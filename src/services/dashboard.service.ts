import { PawPrint, ClipboardPlus, TriangleAlert, Users } from "lucide-react";
import type { DashboardData, RecentEvaluation, RecentPatient, SummaryCard } from "../types/dashboard";
import type { Evaluation, PersistedInferenceResult } from "../types/evaluation";
import type { Owner } from "../types/owner";
import type { Patient } from "../types/patient";
import { evaluationService } from "./evaluation.service";
import { ownerService } from "./owner.service";
import { patientService } from "./patient.service";

const emptyDashboard: DashboardData = {
  recentEvaluations: [],
  recentPatients: [],
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function isCurrentMonth(value?: string | null) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const now = new Date();

  return !Number.isNaN(date.getTime()) && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function monthChange(count: number) {
  return `+${count} este mes`;
}

function normalizeRisk(value?: string | null): "low" | "moderate" | "high" {
  const risk = value?.toLowerCase() ?? "";

  if (risk.includes("alto") || risk.includes("high")) {
    return "high";
  }

  if (risk.includes("moderado") || risk.includes("medium") || risk.includes("moderate")) {
    return "moderate";
  }

  return "low";
}

function pickMainResult(results: PersistedInferenceResult[]) {
  return [...results].sort((first, second) => (second.probability ?? second.score ?? 0) - (first.probability ?? first.score ?? 0))[0];
}

function readName(value: unknown, fallback = "Sin registrar") {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "name" in value && typeof value.name === "string") {
    return value.name;
  }

  return fallback;
}

function speciesBreed(patient: Patient) {
  return `${readName(patient.species, "Especie sin registrar")} / ${readName(patient.breed, "Raza sin registrar")}`;
}

function mapPatient(patient: Patient, evaluationsByPatient: Map<number, Evaluation[]>): RecentPatient {
  const ownerName = [patient.owner.first_name, patient.owner.last_name].filter(Boolean).join(" ") || "Sin propietario";
  const lastEvaluation = evaluationsByPatient.get(patient.id)?.[0];

  return {
    id: patient.id,
    patient: patient.name,
    speciesBreed: speciesBreed(patient),
    owner: ownerName || "Sin propietario",
    lastEvaluation: lastEvaluation ? formatDate(lastEvaluation.created_at) : "Sin evaluaciones",
  };
}

function buildEvaluationsByPatient(evaluations: Evaluation[]) {
  return evaluations.reduce((accumulator, evaluation) => {
    const current = accumulator.get(evaluation.patient_id) ?? [];
    current.push(evaluation);
    accumulator.set(evaluation.patient_id, current);
    return accumulator;
  }, new Map<number, Evaluation[]>());
}

async function readResultsByEvaluation(evaluations: Evaluation[]) {
  const entries = await Promise.all(
    evaluations.map(async (evaluation) => {
      try {
        const results = await evaluationService.listResults(evaluation.id);
        return [evaluation.id, results] as const;
      } catch {
        return [evaluation.id, [] as PersistedInferenceResult[]] as const;
      }
    })
  );

  return new Map(entries);
}

function countCreatedThisMonth<T extends { created_at?: string | null }>(items: T[]) {
  return items.filter((item) => isCurrentMonth(item.created_at)).length;
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    try {
      const [patients, evaluations] = await Promise.all([patientService.list(), evaluationService.list()]);
      const evaluationsByPatient = buildEvaluationsByPatient(evaluations);
      const patientById = new Map(patients.map((patient) => [patient.id, patient]));
      const resultsByEvaluation = await readResultsByEvaluation(evaluations.slice(0, 5));

      const recentEvaluations = evaluations.slice(0, 5).map((evaluation): RecentEvaluation => {
        const patient = patientById.get(evaluation.patient_id);
        const mainResult = pickMainResult(resultsByEvaluation.get(evaluation.id) ?? []);

        return {
          id: evaluation.id,
          patient: patient?.name ?? `Paciente #${evaluation.patient_id}`,
          speciesBreed: patient ? speciesBreed(patient) : "Sin datos clinicos",
          date: formatDate(evaluation.created_at),
          result: mainResult?.suggested_diagnosis ?? evaluation.reason ?? "Pendiente de inferencia",
          risk: normalizeRisk(mainResult?.risk_level),
        };
      });

      const recentPatients = [...patients]
        .sort((first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime())
        .slice(0, 5)
        .map((patient) => mapPatient(patient, evaluationsByPatient));

      return {
        recentPatients,
        recentEvaluations,
      };
    } catch {
      return emptyDashboard;
    }
  },

  async getSummary(): Promise<SummaryCard[]> {
    try {
      const [owners, patients, evaluations] = await Promise.all([
        ownerService.list(),
        patientService.list(),
        evaluationService.list(),
      ]);
      const resultsByEvaluation = await readResultsByEvaluation(evaluations);
      const highRiskCases = [...resultsByEvaluation.values()].filter((results) =>
        results.some((result) => normalizeRisk(result.risk_level) === "high")
      ).length;
      const highRiskCasesThisMonth = evaluations.filter((evaluation) => {
        const results = resultsByEvaluation.get(evaluation.id) ?? [];
        return isCurrentMonth(evaluation.created_at) && results.some((result) => normalizeRisk(result.risk_level) === "high");
      }).length;

      return [
        {
          label: "Propietarios registrados",
          value: String(owners.length),
          change: monthChange(countCreatedThisMonth<Owner>(owners)),
          tone: "primary",
          icon: Users,
        },
        {
          label: "Pacientes registrados",
          value: String(patients.length),
          change: monthChange(countCreatedThisMonth<Patient>(patients)),
          tone: "primary",
          icon: PawPrint,
        },
        {
          label: "Evaluaciones realizadas",
          value: String(evaluations.length),
          change: monthChange(countCreatedThisMonth<Evaluation>(evaluations)),
          tone: "primary",
          icon: ClipboardPlus,
        },
        {
          label: "Casos con riesgo alto",
          value: String(highRiskCases),
          change: monthChange(highRiskCasesThisMonth),
          tone: "danger",
          icon: TriangleAlert,
        },
      ];
    } catch {
      return [];
    }
  },
};
