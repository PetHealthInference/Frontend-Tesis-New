import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ActivatedRulesPanel } from "../../components/evaluations/ActivatedRulesPanel";
import { EvaluationFactsPanel } from "../../components/evaluations/EvaluationFactsPanel";
import { EvaluationResultsPanel } from "../../components/evaluations/EvaluationResultsPanel";
import { HistoryTimeline } from "../../components/evaluations/HistoryTimeline";
import { AlertMessage } from "../../components/common/AlertMessage";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { FormTextarea } from "../../components/common/FormTextarea";
import { useEvaluationFacts } from "../../hooks/useEvaluationFacts";
import { historyService, type PatientHistorySummary } from "../../services/history.service";
import { evaluationService } from "../../services/evaluation.service";
import { patientService } from "../../services/patient.service";
import type { ClinicalFactIn, FactDefinition, Evaluation, PersistedInferenceResult } from "../../types/evaluation";
import type { Patient } from "../../types/patient";

const tabs = ["Datos de evaluación", "Facts y procesamiento", "Resultados", "Historial"] as const;

export function ClinicalEvaluationPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState(searchParams.get("patientId") ?? "");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");
  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [results, setResults] = useState<PersistedInferenceResult[]>([]);
  const [history, setHistory] = useState<PatientHistorySummary | null>(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const patient = useMemo(() => patients.find((item) => String(item.id) === patientId) ?? null, [patientId, patients]);
  const factQuery = useEvaluationFacts(patient?.species.id);

  useEffect(() => {
    patientService.list().then(setPatients).catch((cause: unknown) => setError(message(cause))).finally(() => setIsLoadingPatients(false));
  }, []);

  useEffect(() => {
    if (!patient || activeTab !== 3) return;
    historyService.getPatientHistory(patient.id).then(setHistory).catch((cause: unknown) => setError(message(cause)));
  }, [activeTab, patient]);

  const payloadFacts = useMemo<ClinicalFactIn[]>(() => factQuery.data.flatMap((fact) => {
    const value = values[fact.fact_key];
    return value === undefined || value === "" ? [] : [{ fact_key: fact.fact_key, value, source_type: fact.source_type }];
  }), [factQuery.data, values]);

  function choosePatient(nextId: string) {
    setPatientId(nextId); setValues({}); setEvaluation(null); setResults([]); setHistory(null); setNotice("");
  }
  function changeFact(fact: FactDefinition, value: string | number | boolean | undefined) {
    setValues((current) => { const next = { ...current }; if (value === undefined) delete next[fact.fact_key]; else next[fact.fact_key] = value; return next; });
    setEvaluation(null); setResults([]);
  }
  function goToTab(nextTab: number) {
    if (nextTab > activeTab) {
      for (let tab = activeTab; tab < nextTab; tab += 1) {
        if (!canAdvance(tab, patient, reason, evaluation, results)) {
          setError(validationMessage(tab));
          return;
        }
      }
    }
    setError("");
    setActiveTab(nextTab);
  }
  async function saveEvaluation() {
    if (!patient || !reason.trim() || !payloadFacts.length) { setError("Selecciona un paciente, registra el motivo y completa al menos un fact clínico válido."); return; }
    setIsSaving(true); setError("");
    try { const created = await evaluationService.create({ patient_id: patient.id, reason: reason.trim(), observations: observations.trim() || null, facts: payloadFacts }); setEvaluation(created); setNotice("Evaluación guardada. Ya puede procesarse."); }
    catch (cause) { setError(message(cause)); } finally { setIsSaving(false); }
  }
  async function processEvaluation() {
    if (!evaluation) { setError("Primero guarda la evaluación clínica."); return; }
    setIsProcessing(true); setError("");
    try {
      await evaluationService.process(evaluation.id);
      const persisted = await evaluationService.listResults(evaluation.id);
      const withSnapshots = await Promise.all(persisted.map(async (result) => ({ ...result, activated_rules: await evaluationService.listActivatedRules(result.id) })));
      setResults(withSnapshots); setNotice("Inferencia híbrida procesada y resultados persistidos."); setActiveTab(2);
    } catch (cause) { setError(message(cause)); } finally { setIsProcessing(false); }
  }

  return <div className="space-y-6">
    <section><h1 className="text-3xl font-extrabold text-[#172554]">Evaluación clínica veterinaria</h1><p className="mt-2 text-slate-500">Flujo trazable: paciente → facts → inferencia híbrida → resultados → historial.</p></section>
    {notice ? <AlertMessage message={notice} onClose={() => setNotice("")} /> : null}{error ? <AlertMessage message={error} onClose={() => setError("")} tone="error" /> : null}
    <nav aria-label="Etapas de evaluación" className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">{tabs.map((tab, index) => <button aria-current={activeTab === index ? "step" : undefined} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${activeTab === index ? "bg-[#4635D3] text-white" : "bg-slate-100 text-slate-600"}`} key={tab} onClick={() => goToTab(index)} type="button">{index + 1}. {tab}</button>)}</nav>
    <Card className="p-6 sm:p-8">
      {activeTab === 0 && <div className="space-y-6"><PatientTab isLoading={isLoadingPatients} patient={patient} patients={patients} patientId={patientId} onChange={choosePatient} /><div className="border-t border-slate-100 pt-6"><FormTextarea label="Motivo de consulta" onChange={(event) => { setReason(event.target.value); setEvaluation(null); }} required value={reason} /><div className="mt-5"><FormTextarea label="Observaciones" onChange={(event) => { setObservations(event.target.value); setEvaluation(null); }} value={observations} /></div></div></div>}
      {activeTab === 1 && <div className="space-y-6"><EvaluationFactsPanel error={factQuery.error} facts={factQuery.data} isLoading={factQuery.isLoading} onChange={changeFact} values={values} /><div className="border-t border-slate-100 pt-6"><ProcessingTab evaluation={evaluation} isProcessing={isProcessing} isSaving={isSaving} onProcess={processEvaluation} onSave={saveEvaluation} /></div></div>}
      {activeTab === 2 && <EvaluationResultsPanel results={results} />}
      {activeTab === 3 && <div className="space-y-5"><HistoryTimeline events={history?.events ?? []} evaluations={history?.evaluations ?? []} />{results.flatMap((result) => result.activated_rules).length ? <ActivatedRulesPanel rules={results.flatMap((result) => result.activated_rules)} /> : null}</div>}
    </Card>
    <div className="flex justify-between"><Link className="text-sm font-bold text-[#4635D3]" to="/patients">Volver a pacientes</Link><Button disabled={activeTab === tabs.length - 1} onClick={() => goToTab(activeTab + 1)}>Siguiente etapa</Button></div>
  </div>;
}

function PatientTab({ patients, patientId, patient, isLoading, onChange }: { patients: Patient[]; patientId: string; patient: Patient | null; isLoading: boolean; onChange: (id: string) => void }) {
  if (isLoading) return <div className="h-40 animate-pulse rounded-lg bg-slate-100" />;
  return <div className="space-y-5"><label className="block text-sm font-bold text-slate-700">Paciente<select className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4" onChange={(event) => onChange(event.target.value)} value={patientId}><option value="">Seleccionar paciente…</option>{patients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.species.name}</option>)}</select></label>{patient ? <dl className="grid gap-4 rounded-lg bg-slate-50 p-5 sm:grid-cols-3"><div><dt className="text-xs font-bold text-slate-500">Propietario</dt><dd className="font-bold text-slate-700">{patient.owner.first_name} {patient.owner.last_name ?? ""}</dd></div><div><dt className="text-xs font-bold text-slate-500">Especie</dt><dd className="font-bold text-slate-700">{patient.species.name}</dd></div><div><dt className="text-xs font-bold text-slate-500">Paciente</dt><dd className="font-bold text-slate-700">{patient.name}</dd></div></dl> : <p className="text-sm text-slate-500">El propietario se determina a partir del paciente real seleccionado; el endpoint de evaluación no acepta un propietario independiente.</p>}</div>;
}
function ProcessingTab({ evaluation, isSaving, isProcessing, onSave, onProcess }: { evaluation: Evaluation | null; isSaving: boolean; isProcessing: boolean; onSave: () => void; onProcess: () => void }) { return <div className="space-y-5"><p className="text-slate-600">Guarde los facts validados antes de ejecutar el motor IF–THEN + Bayes.</p><div className="flex flex-wrap gap-3"><Button disabled={isSaving || Boolean(evaluation)} onClick={onSave}>{isSaving ? "Guardando…" : "Guardar evaluación"}</Button><Button disabled={!evaluation || isProcessing} onClick={onProcess}>{isProcessing ? "Procesando…" : "Procesar evaluación"}</Button></div>{evaluation ? <p className="text-sm font-bold text-emerald-700">Evaluación #{evaluation.id} persistida.</p> : null}</div>; }
function canAdvance(tab: number, patient: Patient | null, reason: string, evaluation: Evaluation | null, results: PersistedInferenceResult[]) { if (tab === 0) return Boolean(patient && reason.trim()); if (tab === 1) return Boolean(evaluation); if (tab === 2) return results.length > 0; return true; }
function validationMessage(tab: number) { if (tab === 0) return "Completa los campos obligatorios: Paciente y Motivo de consulta *."; if (tab === 1) return "Guarda la evaluación antes de continuar a Resultados."; if (tab === 2) return "Procesa la evaluación antes de consultar el Historial."; return "Completa la etapa actual antes de continuar."; }
function message(error: unknown) { return error && typeof error === "object" && "response" in error ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "No fue posible completar la operación clínica." : "No fue posible completar la operación clínica."; }
