import {
  Bookmark,
  CheckCircle2,
  Info,
  Loader2,
  Play,
  Save,
  Stethoscope,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { FormSelect } from "../../components/common/FormSelect";
import { FormTextarea } from "../../components/common/FormTextarea";
import { evaluationService } from "../../services/evaluation.service";
import { patientService } from "../../services/patient.service";
import type {
  CatalogItem,
  ClinicalFactIn,
  ClinicalVariable,
  Evaluation,
  ProcessEvaluationResponse,
} from "../../types/evaluation";
import type { Patient } from "../../types/patient";
import { cn } from "../../utils/cn";

type FieldErrors = {
  patientId?: string;
  reason?: string;
  facts?: string;
};

function getOwnerName(patient: Patient) {
  return [patient.owner.first_name, patient.owner.last_name].filter(Boolean).join(" ") || "Sin propietario";
}

function getPatientLabel(patient: Patient) {
  return `${patient.name} · ${patient.species.name}${patient.breed ? ` / ${patient.breed.name}` : ""}`;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail ?? "No fue posible completar la evaluacion.";
  }

  return "No fue posible completar la evaluacion.";
}

function isStringVariable(variable: ClinicalVariable) {
  return ["string", "text", "select", "boolean"].includes(variable.data_type.toLowerCase());
}

function getStringOptions(variable: ClinicalVariable) {
  const key = variable.key.toLowerCase();

  if (key.includes("placa")) {
    return ["leve", "moderada/severa"];
  }

  if (key.includes("felv") || key.includes("snap")) {
    return ["positivo", "negativo"];
  }

  return ["presente", "ausente"];
}

function normalRange(variable: ClinicalVariable) {
  if (variable.normal_min == null && variable.normal_max == null) {
    return variable.unit ? variable.unit : "Valor clinico";
  }

  const range = [variable.normal_min, variable.normal_max].filter((value) => value != null).join(" - ");
  return `${range}${variable.unit ? ` ${variable.unit}` : ""}`;
}

function buildFacts(
  symptoms: CatalogItem[],
  selectedSymptoms: Set<number>,
  variables: ClinicalVariable[],
  variableValues: Record<string, string>
): ClinicalFactIn[] {
  const symptomFacts: ClinicalFactIn[] = symptoms
    .filter((symptom) => selectedSymptoms.has(symptom.id))
    .map((symptom) => ({
      fact_key: symptom.name,
      value: true,
      source_type: "symptom",
    }));

  const variableFacts: ClinicalFactIn[] = variables
    .map((variable): ClinicalFactIn | null => {
      const rawValue = variableValues[variable.key]?.trim();

      if (!rawValue) {
        return null;
      }

      return {
        fact_key: variable.key,
        value: isStringVariable(variable) ? rawValue : Number(rawValue),
        source_type: "clinical_variable" as const,
      };
    })
    .filter((fact): fact is ClinicalFactIn => Boolean(fact));

  return [...symptomFacts, ...variableFacts];
}

export function ClinicalEvaluationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get("patientId") ?? "";
  const [patients, setPatients] = useState<Patient[]>([]);
  const [symptoms, setSymptoms] = useState<CatalogItem[]>([]);
  const [clinicalVariables, setClinicalVariables] = useState<ClinicalVariable[]>([]);
  const [patientId, setPatientId] = useState(initialPatientId);
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<number>>(new Set());
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [processedResponse, setProcessedResponse] = useState<ProcessEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const [patientData, symptomData, variableData] = await Promise.all([
          patientService.list(),
          evaluationService.listSymptoms(),
          evaluationService.listClinicalVariables(),
        ]);

        if (isMounted) {
          setPatients(patientData);
          setSymptoms(symptomData.filter((item) => item.is_active));
          setClinicalVariables(variableData.filter((item) => item.is_active));
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(getErrorMessage(caughtError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPatient = useMemo(
    () => patients.find((patient) => String(patient.id) === patientId) ?? null,
    [patientId, patients]
  );

  const filteredSymptoms = useMemo(() => {
    if (!selectedPatient) {
      return [];
    }

    return symptoms.filter(
      (symptom) => symptom.species_id == null || symptom.species_id === selectedPatient.species.id
    );
  }, [selectedPatient, symptoms]);

  const filteredVariables = useMemo(() => {
    if (!selectedPatient) {
      return [];
    }

    return clinicalVariables.filter(
      (variable) => variable.species_id == null || variable.species_id === selectedPatient.species.id
    );
  }, [clinicalVariables, selectedPatient]);

  const facts = useMemo(
    () => buildFacts(filteredSymptoms, selectedSymptoms, filteredVariables, variableValues),
    [filteredSymptoms, filteredVariables, selectedSymptoms, variableValues]
  );

  function markDirty() {
    setEvaluation(null);
    setProcessedResponse(null);
    setMessage("");
  }

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (!patientId) {
      nextErrors.patientId = "Selecciona un paciente para continuar.";
    }

    if (!reason.trim()) {
      nextErrors.reason = "Ingresa el motivo de consulta.";
    }

    if (facts.length === 0) {
      nextErrors.facts = "Selecciona al menos un sintoma o registra una variable clinica.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handlePatientChange(event: ChangeEvent<HTMLSelectElement>) {
    setPatientId(event.target.value);
    setSelectedSymptoms(new Set());
    setVariableValues({});
    setErrors((current) => ({ ...current, patientId: undefined, facts: undefined }));
    markDirty();
  }

  function toggleSymptom(symptomId: number) {
    setSelectedSymptoms((current) => {
      const next = new Set(current);

      if (next.has(symptomId)) {
        next.delete(symptomId);
      } else {
        next.add(symptomId);
      }

      return next;
    });
    setErrors((current) => ({ ...current, facts: undefined }));
    markDirty();
  }

  function updateVariable(key: string, value: string) {
    setVariableValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, facts: undefined }));
    markDirty();
  }

  async function handleSave() {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const saved = await evaluationService.create({
        patient_id: Number(patientId),
        reason: reason.trim(),
        observations: observations.trim() || null,
        facts,
      });

      setEvaluation(saved);
      setMessage("Evaluacion guardada correctamente. Ya puedes procesarla.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleProcess() {
    if (!evaluation) {
      setErrors((current) => ({ ...current, facts: "Primero guarda una evaluacion valida antes de procesar." }));
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const processed = await evaluationService.process(evaluation.id);
      setProcessedResponse(processed);
      setMessage("Evaluacion procesada correctamente. El detalle de resultados queda preparado.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-extrabold tracking-normal text-[#172554]">Nueva evaluacion clinica</h1>
        <p className="mt-2 text-base text-slate-500">
          Registra los datos clinicos del paciente y procesa la evaluacion para obtener un resultado sugerido.
        </p>
      </section>

      <EvaluationStepper hasPatient={Boolean(selectedPatient)} hasFacts={facts.length > 0} isSaved={Boolean(evaluation)} />

      {message ? <AlertMessage message={message} onClose={() => setMessage("")} /> : null}
      {error ? <AlertMessage message={error} tone="error" onClose={() => setError("")} /> : null}

      <Card className="p-6 sm:p-8">
        {isLoading ? (
          <div className="h-96 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <div className="space-y-6">
            <section>
              <SectionTitle number="1" title="Datos de la evaluacion" />
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr_1fr]">
                <FormSelect error={errors.patientId} label="Paciente" onChange={handlePatientChange} required value={patientId}>
                  <option value="">Buscar y seleccionar paciente</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {getPatientLabel(patient)}
                    </option>
                  ))}
                </FormSelect>
                <ReadOnlyField label="Propietario" value={selectedPatient ? getOwnerName(selectedPatient) : "-"} />
                <ReadOnlyField label="Especie" value={selectedPatient?.species.name ?? "-"} />
              </div>
              <div className="mt-5">
                <FormTextarea
                  error={errors.reason}
                  label="Motivo de consulta"
                  onChange={(event) => {
                    setReason(event.target.value);
                    setErrors((current) => ({ ...current, reason: undefined }));
                    markDirty();
                  }}
                  placeholder="Ej. Poliuria, polidipsia y perdida de peso observadas por el propietario."
                  required
                  value={reason}
                />
              </div>
            </section>

            <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-700">
              <Info className="mt-0.5 shrink-0" size={18} />
              <span>Los sintomas y variables clinicas se muestran filtrados segun la especie del paciente seleccionado.</span>
            </div>

            {errors.facts ? <AlertMessage message={errors.facts} tone="error" /> : null}

            <section className="grid gap-5 xl:grid-cols-[0.9fr_1.45fr]">
              <div className="rounded-lg border border-slate-100 p-5">
                <SectionTitle number="2" title="Sintomas observados" />
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Selecciona los sintomas observados durante la evaluacion inicial.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {selectedPatient ? (
                    filteredSymptoms.map((symptom) => (
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-600" key={symptom.id}>
                        <input
                          checked={selectedSymptoms.has(symptom.id)}
                          className="h-5 w-5 rounded border-slate-300 text-[#4635D3] focus:ring-[#4635D3]"
                          onChange={() => toggleSymptom(symptom.id)}
                          type="checkbox"
                        />
                        {symptom.name}
                      </label>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm font-semibold text-slate-400">Selecciona un paciente para ver sintomas.</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 p-5">
                <SectionTitle number="3" title="Variables clinicas" />
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Completa solo las variables disponibles para este paciente.
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {selectedPatient ? (
                    filteredVariables.map((variable) =>
                      isStringVariable(variable) ? (
                        <FormSelect
                          key={variable.id}
                          label={variable.name}
                          onChange={(event) => updateVariable(variable.key, event.target.value)}
                          value={variableValues[variable.key] ?? ""}
                        >
                          <option value="">Seleccionar...</option>
                          {getStringOptions(variable).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </FormSelect>
                      ) : (
                        <label className="block" key={variable.id}>
                          <span className="mb-2 block text-sm font-bold text-slate-700">
                            {variable.name}
                            {variable.unit ? ` (${variable.unit})` : ""}
                          </span>
                          <input
                            className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#4635D3] focus:ring-4 focus:ring-[#4635D3]/10"
                            onChange={(event) => updateVariable(variable.key, event.target.value)}
                            placeholder={normalRange(variable)}
                            type="number"
                            step="0.01"
                            value={variableValues[variable.key] ?? ""}
                          />
                        </label>
                      )
                    )
                  ) : (
                    <p className="col-span-full text-sm font-semibold text-slate-400">
                      Selecciona un paciente para ver variables clinicas.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.9fr_1.45fr]">
              <div className="rounded-lg border border-slate-100 p-5">
                <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#172554]">
                  <Stethoscope size={22} />
                  Observaciones
                </h2>
                <textarea
                  className="mt-5 min-h-24 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#4635D3] focus:ring-4 focus:ring-[#4635D3]/10"
                  onChange={(event) => {
                    setObservations(event.target.value);
                    markDirty();
                  }}
                  placeholder="Observaciones adicionales del veterinario..."
                  value={observations}
                />
              </div>

              <div className="rounded-lg border border-slate-100 p-5">
                <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#172554]">
                  <Bookmark size={22} />
                  Resumen de facts preparados
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Vista previa de los datos que se enviaran al motor de inferencia.
                </p>
                <div className="mt-5 min-h-20 rounded-lg border border-dashed border-slate-200 p-4">
                  {facts.length === 0 ? (
                    <span className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400">
                      Aun no hay datos seleccionados
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {facts.map((fact) => (
                        <span
                          className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-[#3026A6]"
                          key={`${fact.fact_key}-${String(fact.value)}`}
                        >
                          {fact.fact_key}: {String(fact.value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {processedResponse ? (
              <section className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-emerald-800">
                  <CheckCircle2 size={22} />
                  Evaluacion procesada
                </h2>
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  Se generaron {processedResponse.resultados.length} resultado(s). El modulo de resultados se implementara en
                  la siguiente etapa.
                </p>
                <Button className="mt-4" onClick={() => navigate(`/results?evaluationId=${processedResponse.evaluacion_id}`)}>
                  Ir a resultados
                </Button>
              </section>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                to="/patients"
              >
                Cancelar
              </Link>
              <Button disabled={isSaving} icon={isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} onClick={handleSave} variant="secondary">
                {isSaving ? "Guardando..." : "Guardar evaluacion"}
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!evaluation || isProcessing}
                icon={isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                onClick={handleProcess}
              >
                {isProcessing ? "Procesando..." : "Procesar evaluacion"}
              </Button>
            </div>

            <p className="text-center text-sm font-semibold text-blue-600">
              Primero guarda la evaluacion. Luego procesa los facts para ejecutar el motor de inferencia.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function EvaluationStepper({
  hasPatient,
  hasFacts,
  isSaved,
}: {
  hasPatient: boolean;
  hasFacts: boolean;
  isSaved: boolean;
}) {
  const steps = [
    { label: "Paciente", active: hasPatient },
    { label: "Sintomas", active: hasFacts },
    { label: "Variables clinicas", active: hasFacts },
    { label: "Procesar", active: isSaved },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => (
        <div className="flex items-center gap-3" key={step.label}>
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-extrabold",
              step.active ? "border-[#4635D3] bg-[#4635D3] text-white" : "border-slate-200 bg-slate-100 text-slate-400"
            )}
          >
            {index + 1}
          </span>
          <span className={cn("text-sm font-extrabold", step.active ? "text-[#4635D3]" : "text-slate-400")}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#172554]">
      <span className="grid h-7 w-7 place-items-center rounded-md border border-[#4635D3]/30 bg-violet-50 text-sm text-[#4635D3]">
        {number}
      </span>
      {title}
    </h2>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <div className="flex h-12 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-500">
        {value}
      </div>
    </label>
  );
}
