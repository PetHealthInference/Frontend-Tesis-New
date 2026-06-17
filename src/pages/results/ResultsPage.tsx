import {
  ArrowLeft,
  Calendar,
  Check,
  ClipboardPlus,
  FileClock,
  FlaskConical,
  HeartHandshake,
  Info,
  LineChart,
  PawPrint,
  Scale,
  Settings,
  UserRound,
  VenusAndMars,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import { Card } from "../../components/common/Card";
import { DataTable } from "../../components/common/DataTable";
import { evaluationService } from "../../services/evaluation.service";
import { patientService } from "../../services/patient.service";
import type { ClinicalFactOut, Evaluation, PersistedInferenceResult } from "../../types/evaluation";
import type { Patient } from "../../types/patient";
import { cn } from "../../utils/cn";

function getOwnerName(patient: Patient) {
  return [patient.owner.first_name, patient.owner.last_name].filter(Boolean).join(" ") || "Sin propietario";
}

function getInitial(patient: Patient) {
  return patient.name.charAt(0).toUpperCase();
}

function calculateAge(birthDate?: string | null) {
  if (!birthDate) {
    return "Sin fecha";
  }

  const birth = new Date(`${birthDate}T00:00:00`);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
  }

  if (years <= 0) {
    const months = Math.max(
      0,
      (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth()
    );
    return `${months || 1} ${months === 1 ? "mes" : "meses"}`;
  }

  return `${years} ${years === 1 ? "año" : "años"}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Sin registrar";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getRiskTone(riskLevel?: string | null) {
  const risk = riskLevel?.toLowerCase() ?? "";

  if (risk.includes("alto")) {
    return {
      label: "Riesgo alto",
      className: "bg-red-50 text-red-700",
      iconClassName: "bg-red-50 text-red-600",
    };
  }

  if (risk.includes("moder")) {
    return {
      label: "Riesgo moderado",
      className: "bg-amber-50 text-amber-700",
      iconClassName: "bg-amber-50 text-amber-600",
    };
  }

  return {
    label: "Riesgo bajo",
    className: "bg-emerald-50 text-emerald-700",
    iconClassName: "bg-emerald-50 text-emerald-600",
  };
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail ?? "No fue posible cargar los resultados.";
  }

  return "No fue posible cargar los resultados.";
}

function factLabel(fact: ClinicalFactOut) {
  return `${fact.fact_key}: ${String(fact.value)}`;
}

function splitFacts(facts: ClinicalFactOut[] = []) {
  return {
    symptoms: facts.filter((fact) => fact.source_type === "symptom"),
    variables: facts.filter((fact) => fact.source_type !== "symptom"),
  };
}

function primaryResult(results: PersistedInferenceResult[]) {
  return [...results].sort((a, b) => b.score - a.score)[0] ?? null;
}

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const evaluationId = searchParams.get("evaluationId");
  const parsedEvaluationId = evaluationId ? Number(evaluationId) : null;
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [results, setResults] = useState<PersistedInferenceResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadResults() {
      if (!parsedEvaluationId || Number.isNaN(parsedEvaluationId)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const evaluationData = await evaluationService.getById(parsedEvaluationId);
        const [patientData, resultData] = await Promise.all([
          patientService.getById(evaluationData.patient_id),
          evaluationService.listResults(parsedEvaluationId),
        ]);

        if (isMounted) {
          setEvaluation(evaluationData);
          setPatient(patientData);
          setResults(resultData);
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

    loadResults();

    return () => {
      isMounted = false;
    };
  }, [parsedEvaluationId]);

  const result = useMemo(() => primaryResult(results), [results]);
  const facts = splitFacts(evaluation?.facts ?? []);
  const riskTone = getRiskTone(result?.risk_level);

  if (!evaluationId || Number.isNaN(parsedEvaluationId)) {
    return (
      <AlertMessage
        message="No se recibio un identificador de evaluacion valido. Abre resultados desde una evaluacion procesada."
        tone="error"
      />
    );
  }

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (error) {
    return <AlertMessage message={error} tone="error" />;
  }

  if (!evaluation || !patient) {
    return <AlertMessage message="No se encontro la evaluacion solicitada." tone="error" />;
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <PageHeader patientId={patient.id} />
        <Card className="grid min-h-80 place-items-center p-8 text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-violet-50 text-[#4635D3]">
              <LineChart size={30} />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-[#172554]">Evaluacion sin resultados procesados</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Esta evaluacion existe, pero aun no tiene resultados persistidos. Procesala desde la pantalla de evaluacion
              clinica.
            </p>
            <Link
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4635D3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3526AD]"
              to={`/evaluations?patientId=${patient.id}`}
            >
              <ClipboardPlus size={18} />
              Nueva evaluacion
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader patientId={patient.id} />

      <Card className="p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.6fr]">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-8">
            <span className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-violet-50 text-5xl font-extrabold text-[#3026A6]">
              {getInitial(patient)}
            </span>
            <div>
              <h2 className="text-3xl font-extrabold text-[#172554]">{patient.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-500">
                <PawPrint size={20} />
                {patient.species.name} · {patient.breed?.name ?? "Sin raza"}
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-500">
                <UserRound size={20} />
                {getOwnerName(patient)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile icon={Calendar} label="Fecha de procesamiento" value={formatDate(evaluation.created_at)} />
            <InfoTile icon={VenusAndMars} label="Sexo" value={patient.sex || "Sin registrar"} />
            <InfoTile icon={ClipboardPlus} label="Edad" value={calculateAge(patient.birth_date)} />
            <InfoTile icon={Scale} label="Peso" value={patient.weight ? `${patient.weight} kg` : "Sin registrar"} />
          </div>
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={ClipboardPlus} label="Resultado sugerido" value={result.suggested_diagnosis} />
        <SummaryCard icon={AlertTriangle} iconClassName={riskTone.iconClassName} label="Nivel de riesgo">
          <span className={cn("inline-flex rounded-md px-3 py-1 text-sm font-extrabold", riskTone.className)}>
            {riskTone.label}
          </span>
        </SummaryCard>
        <SummaryCard icon={Check} iconClassName="bg-emerald-50 text-emerald-600" label="Estado de procesamiento" value="Evaluacion procesada" />
        <SummaryCard icon={Settings} label="Motor aplicado" value={result.inference_method ?? "Reglas IF-THEN + inferencia clinica"} />
      </section>

      <Card className="p-6">
        <div className="flex gap-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-violet-50 text-[#3026A6]">
            <Info size={30} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-[#172554]">Explicacion del resultado</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {result.explanation ||
                "El resultado sugerido se obtuvo a partir de los sintomas y variables clinicas registradas en la evaluacion."}
            </p>
            <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Este resultado apoya la evaluacion clinica inicial y no reemplaza el juicio profesional del medico veterinario.
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.05fr]">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-extrabold text-[#172554]">
            <Scale size={24} />
            Reglas activadas
          </h2>
          {result.activated_rules.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">No hay reglas activadas asociadas.</p>
          ) : (
            <DataTable
              columns={["Regla", "Justificacion"]}
              rows={result.activated_rules}
              renderRow={(rule) => (
                <tr key={rule.id}>
                  <td className="whitespace-nowrap px-5 py-3 font-extrabold text-slate-700">#{rule.rule_id}</td>
                  <td className="px-5 py-3">{rule.justification || "Regla activada por condiciones cumplidas."}</td>
                </tr>
              )}
            />
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-3 text-xl font-extrabold text-[#172554]">
            <FlaskConical size={24} />
            Variables consideradas
          </h2>
          <FactGroup facts={facts.symptoms} title="Sintomas observados" tone="green" />
          <FactGroup facts={facts.variables} title="Variables clinicas" tone="violet" />
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex gap-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-violet-50 text-[#4635D3]">
            <HeartHandshake size={28} />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-[#172554]">Recomendacion de seguimiento</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Se recomienda realizar una evaluacion clinica complementaria y confirmar el diagnostico con el medico
              veterinario antes de definir el manejo definitivo del paciente.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#3026A6] shadow-sm transition hover:bg-violet-50"
          to="/results"
        >
          <ArrowLeft size={18} />
          Volver a resultados
        </Link>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#3026A6] shadow-sm transition hover:bg-violet-50"
          to={`/patients/${patient.id}/history`}
        >
          <FileClock size={18} />
          Ver historial clinico
        </Link>
      </div>
    </div>
  );
}

function PageHeader({ patientId }: { patientId?: number }) {
  return (
    <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
          <Link className="text-[#4635D3] hover:text-[#3026A6]" to="/results">
            Resultados
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Detalle del resultado</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-normal text-[#172554]">Resultado de la evaluacion</h1>
        <p className="mt-2 text-base text-slate-500">Interpretacion generada a partir de la evaluacion clinica procesada.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4635D3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3526AD]"
          to={patientId ? `/evaluations?patientId=${patientId}` : "/evaluations"}
        >
          <ClipboardPlus size={20} />
          Nueva evaluacion
        </Link>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#3026A6] shadow-sm transition hover:bg-violet-50"
          to={patientId ? `/patients/${patientId}/history` : "/history"}
        >
          <FileClock size={20} />
          Ver historial clinico
        </Link>
      </div>
    </section>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-2 py-3">
      <Icon className="shrink-0 text-[#4635D3]" size={25} />
      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-1 font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  iconClassName,
  label,
  value,
  children,
}: {
  icon: typeof ClipboardPlus;
  iconClassName?: string;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <span className={cn("grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-50 text-[#4635D3]", iconClassName)}>
          <Icon size={29} />
        </span>
        <div>
          <p className="text-sm font-extrabold text-slate-500">{label}</p>
          {children ?? <p className="mt-2 text-xl font-extrabold text-[#3026A6]">{value}</p>}
        </div>
      </div>
    </Card>
  );
}

function FactGroup({ facts, title, tone }: { facts: ClinicalFactOut[]; title: string; tone: "green" | "violet" }) {
  return (
    <div className="mb-5 last:mb-0">
      <h3 className="mb-3 text-sm font-extrabold text-slate-600">{title}</h3>
      {facts.length === 0 ? (
        <p className="text-sm font-semibold text-slate-400">Sin datos registrados.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {facts.map((fact) => (
            <span
              className={cn(
                "rounded-md px-4 py-2 text-sm font-extrabold",
                tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-[#4635D3]"
              )}
              key={fact.id}
            >
              {factLabel(fact)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
