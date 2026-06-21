import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  ClipboardList,
  Edit3,
  History,
  PawPrint,
  Scale,
  UserRound,
  VenusAndMars,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { DataTable } from "../../components/common/DataTable";
import { Modal } from "../../components/common/Modal";
import { PatientForm } from "../../components/patients/PatientForm";
import { evaluationService } from "../../services/evaluation.service";
import { ownerService } from "../../services/owner.service";
import { patientService } from "../../services/patient.service";
import type { Evaluation } from "../../types/evaluation";
import type { Owner } from "../../types/owner";
import type { Breed, Patient, PatientPayload, Species } from "../../types/patient";

function getOwnerName(patient: Patient) {
  return [patient.owner.first_name, patient.owner.last_name].filter(Boolean).join(" ") || "Sin propietario";
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
    month: "short",
    year: "numeric",
  }).format(new Date(value.includes("T") ? value : `${value}T00:00:00`));
}

function getInitial(patient: Patient) {
  return patient.name.charAt(0).toUpperCase();
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail ?? "No fue posible cargar el paciente.";
  }

  return "No fue posible cargar el paciente.";
}

function getEvaluationDate(evaluation: Evaluation) {
  return evaluation.evaluation_date ?? evaluation.created_at ?? evaluation.date ?? "";
}

export function PatientDetailPage() {
  const { patientId } = useParams();
  const parsedPatientId = patientId ? Number(patientId) : null;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPatient() {
      if (!parsedPatientId) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [patientData, evaluationData] = await Promise.all([
          patientService.getById(parsedPatientId),
          evaluationService.listByPatient(parsedPatientId).catch(() => [] as Evaluation[]),
        ]);
        const [ownerData, speciesData] = await Promise.all([ownerService.list(), patientService.listSpecies()]);

        if (isMounted) {
          setPatient(patientData);
          setEvaluations(evaluationData);
          setOwners(ownerData);
          setSpecies(speciesData);
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

    loadPatient();

    return () => {
      isMounted = false;
    };
  }, [parsedPatientId]);

  const handleSpeciesChange = useCallback(async (speciesId: number | null) => {
    if (!speciesId) {
      setBreeds([]);
      return;
    }

    try {
      const data = await patientService.listBreeds(speciesId);
      setBreeds(data);
    } catch {
      setBreeds([]);
    }
  }, []);

  if (!parsedPatientId || Number.isNaN(parsedPatientId)) {
    return <Navigate replace to="/patients" />;
  }

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (error || !patient) {
    return <AlertMessage message={error || "Paciente no encontrado."} tone="error" />;
  }

  async function handleUpdate(payload: PatientPayload) {
    if (!patient) {
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const updatedPatient = await patientService.update(patient.id, payload);
      setPatient(updatedPatient);
      setSuccess("Paciente actualizado correctamente.");
      setIsEditOpen(false);
    } catch (caughtError) {
      setFormError(getErrorMessage(caughtError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-slate-500 hover:text-[#3026A6]" to="/patients">
            <ArrowLeft size={18} />
            Volver a Pacientes
          </Link>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#172554]">{patient.name}</h1>
          <p className="mt-2 text-base text-slate-500">Informacion general del paciente y seguimiento clinico.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4635D3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3526AD] focus:outline-none focus:ring-2 focus:ring-[#4635D3]/30"
            to={`/evaluations?patientId=${patient.id}`}
          >
            <PawPrint size={20} />
            Nueva evaluacion
          </Link>
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4635D3]/30"
            to={`/patients/${patient.id}/history`}
          >
            <History size={19} />
            Ver historial
          </Link>
          <Button
            icon={<Edit3 size={19} />}
            onClick={() => {
              setBreeds([]);
              setFormError("");
              setIsEditOpen(true);
            }}
            type="button"
            variant="secondary"
          >
            Editar
          </Button>
        </div>
      </section>

      {success ? <AlertMessage message={success} onClose={() => setSuccess("")} /> : null}

      <Card className="p-6 sm:p-8">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-violet-50 text-4xl font-extrabold text-[#3026A6]">
            {getInitial(patient)}
          </span>
          <div>
            <h2 className="text-3xl font-extrabold text-[#172554]">{patient.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-500">
              <PawPrint size={20} />
              {patient.species.name} · {patient.breed?.name ?? "Sin raza"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={UserRound} label="Propietario" value={getOwnerName(patient)} />
          <InfoCard icon={VenusAndMars} label="Sexo" value={patient.sex || "Sin registrar"} />
          <InfoCard icon={Scale} label="Peso" value={patient.weight ? `${patient.weight} kg` : "Sin registrar"} />
          <InfoCard icon={Calendar} label="Fecha de nacimiento" value={formatDate(patient.birth_date)} />
          <InfoCard icon={CalendarPlus} label="Edad" value={calculateAge(patient.birth_date)} />
          <InfoCard icon={ClipboardList} label="Fecha de registro" value={formatDate(patient.created_at)} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-xl font-extrabold text-[#172554]">
              <ClipboardList size={24} />
              Historial clinico
            </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Evaluaciones registradas para este paciente.</p>
          </div>
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4635D3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3526AD] focus:outline-none focus:ring-2 focus:ring-[#4635D3]/30"
            to={`/evaluations?patientId=${patient.id}`}
          >
            <CalendarPlus size={18} />
            Nueva evaluacion
          </Link>
        </div>

        {evaluations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-extrabold text-[#172554]">Sin evaluaciones registradas</p>
            <p className="mt-2 text-sm text-slate-500">Cuando se cree una evaluacion clinica, aparecera en este historial.</p>
          </div>
        ) : (
          <DataTable
            columns={["Fecha", "Motivo / Resumen", "Resultado sugerido", "Riesgo", "Accion"]}
            rows={evaluations}
            renderRow={(evaluation) => (
              <tr key={evaluation.id}>
                <td className="whitespace-nowrap px-5 py-4 font-semibold">{formatDate(getEvaluationDate(evaluation))}</td>
                <td className="px-5 py-4 font-semibold">Evaluacion clinica inicial</td>
                <td className="px-5 py-4">{evaluation.result ?? "Pendiente de resultado"}</td>
                <td className="px-5 py-4">{typeof evaluation.risk_level === "string" ? evaluation.risk_level : evaluation.risk_level?.name ?? "Sin riesgo"}</td>
                <td className="px-5 py-4">
                  <Button variant="secondary">Ver resultado</Button>
                </td>
              </tr>
            )}
          />
        )}
      </Card>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar paciente">
        <PatientForm
          breeds={breeds}
          error={formError}
          isSaving={isSaving}
          mode="edit"
          onCancel={() => setIsEditOpen(false)}
          onSpeciesChange={handleSpeciesChange}
          onSubmit={handleUpdate}
          owners={owners}
          patient={patient}
          species={species}
        />
      </Modal>
    </div>
  );
}

type InfoCardProps = {
  icon: typeof UserRound;
  label: string;
  value: string;
};

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 px-5 py-4">
      <Icon className="shrink-0 text-[#4635D3]" size={25} />
      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-1 font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
