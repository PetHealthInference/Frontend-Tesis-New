import { PawPrint, ClipboardPlus, TriangleAlert, Users } from "lucide-react";
import type { DashboardData, RecentEvaluation, RecentPatient, SummaryCard } from "../types/dashboard";
import type { Patient } from "../types/patient";
import { ownerService } from "./owner.service";
import { patientService } from "./patient.service";

const mockEvaluations: RecentEvaluation[] = [
  {
    id: 1,
    patient: "Max",
    speciesBreed: "Canino / Golden Retriever",
    date: "24/05/2025",
    result: "Dermatitis alergica",
    risk: "low",
  },
  {
    id: 2,
    patient: "Luna",
    speciesBreed: "Felino / Europeo",
    date: "23/05/2025",
    result: "Enfermedad renal cronica",
    risk: "moderate",
  },
  {
    id: 3,
    patient: "Rocky",
    speciesBreed: "Canino / Bulldog Frances",
    date: "22/05/2025",
    result: "Displasia de cadera",
    risk: "high",
  },
  {
    id: 4,
    patient: "Milo",
    speciesBreed: "Felino / Siames",
    date: "21/05/2025",
    result: "Cistitis idiopatica felina",
    risk: "low",
  },
  {
    id: 5,
    patient: "Nina",
    speciesBreed: "Canino / Beagle",
    date: "20/05/2025",
    result: "Gastroenteritis aguda",
    risk: "moderate",
  },
];

const mockPatients: RecentPatient[] = [
  {
    id: 1,
    patient: "Max",
    speciesBreed: "Canino / Golden Retriever",
    owner: "Maria Gonzalez",
    lastEvaluation: "24/05/2025",
  },
  {
    id: 2,
    patient: "Luna",
    speciesBreed: "Felino / Europeo",
    owner: "Carlos Ramirez",
    lastEvaluation: "23/05/2025",
  },
  {
    id: 3,
    patient: "Rocky",
    speciesBreed: "Canino / Bulldog Frances",
    owner: "Ana Lopez",
    lastEvaluation: "22/05/2025",
  },
  {
    id: 4,
    patient: "Milo",
    speciesBreed: "Felino / Siames",
    owner: "Javier Torres",
    lastEvaluation: "Sin evaluaciones registradas",
  },
  {
    id: 5,
    patient: "Nina",
    speciesBreed: "Canino / Beagle",
    owner: "Laura Martinez",
    lastEvaluation: "20/05/2025",
  },
];

function readName(value: unknown, fallback = "Sin registrar") {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "name" in value && typeof value.name === "string") {
    return value.name;
  }

  return fallback;
}

function mapPatient(patient: Patient): RecentPatient {
  const ownerName = [patient.owner.first_name, patient.owner.last_name].filter(Boolean).join(" ") || "Sin propietario";

  return {
    id: patient.id,
    patient: patient.name,
    speciesBreed: `${readName(patient.species, "Especie sin registrar")} / ${readName(
      patient.breed,
      "Raza sin registrar"
    )}`,
    owner: ownerName || "Sin propietario",
    lastEvaluation: "Pendiente de evaluacion",
  };
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    try {
      const patients = await patientService.list();
      const recentPatients = patients.slice(0, 5).map(mapPatient);

      return {
        recentPatients: recentPatients.length ? recentPatients : mockPatients,
        recentEvaluations: mockEvaluations,
      };
    } catch {
      return {
        recentEvaluations: mockEvaluations,
        recentPatients: mockPatients,
      };
    }
  },

  async getSummary(): Promise<SummaryCard[]> {
    try {
      const [owners, patients] = await Promise.all([ownerService.list(), patientService.list()]);

      return [
        {
          label: "Propietarios registrados",
          value: String(owners.length),
          change: "+0 este mes",
          tone: "primary",
          icon: Users,
        },
        {
          label: "Pacientes registrados",
          value: String(patients.length),
          change: "+0 este mes",
          tone: "primary",
          icon: PawPrint,
        },
        {
          label: "Evaluaciones realizadas",
          value: "0",
          change: "+0 este mes",
          tone: "primary",
          icon: ClipboardPlus,
        },
        {
          label: "Casos con riesgo alto",
          value: "0",
          change: "+0 este mes",
          tone: "danger",
          icon: TriangleAlert,
        },
      ];
    } catch {
      return [
        {
          label: "Propietarios registrados",
          value: "248",
          change: "+12 este mes",
          tone: "primary",
          icon: Users,
        },
        {
          label: "Pacientes registrados",
          value: "362",
          change: "+18 este mes",
          tone: "primary",
          icon: PawPrint,
        },
        {
          label: "Evaluaciones realizadas",
          value: "1,247",
          change: "+56 este mes",
          tone: "primary",
          icon: ClipboardPlus,
        },
        {
          label: "Casos con riesgo alto",
          value: "23",
          change: "+3 este mes",
          tone: "danger",
          icon: TriangleAlert,
        },
      ];
    }
  },
};
