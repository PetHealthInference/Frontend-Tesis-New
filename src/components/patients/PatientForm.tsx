import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Info, PawPrint, Save } from "lucide-react";
import { AlertMessage } from "../common/AlertMessage";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { FormField } from "../common/FormField";
import { FormSelect } from "../common/FormSelect";
import type { Owner } from "../../types/owner";
import type { Breed, Patient, PatientFormValues, PatientPayload, Species } from "../../types/patient";

type PatientFormProps = {
  patient?: Patient;
  owners: Owner[];
  species: Species[];
  breeds: Breed[];
  initialOwnerId?: string;
  isSaving: boolean;
  error?: string;
  mode: "create" | "edit";
  onSpeciesChange: (speciesId: number | null) => void;
  onSubmit: (payload: PatientPayload) => Promise<void>;
};

type FormErrors = Partial<Record<keyof PatientFormValues, string>>;

const emptyValues: PatientFormValues = {
  owner_id: "",
  name: "",
  species_id: "",
  breed_id: "",
  sex: "",
  birth_date: "",
  weight: "",
};

function normalizePayload(values: PatientFormValues): PatientPayload {
  return {
    owner_id: Number(values.owner_id),
    name: values.name.trim(),
    species_id: Number(values.species_id),
    breed_id: values.breed_id ? Number(values.breed_id) : null,
    sex: values.sex,
    birth_date: values.birth_date || null,
    weight: values.weight ? Number(values.weight) : null,
  };
}

function validate(values: PatientFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.owner_id) {
    errors.owner_id = "Selecciona un propietario existente.";
  }

  if (!values.name.trim()) {
    errors.name = "Ingresa el nombre del paciente.";
  }

  if (!values.species_id) {
    errors.species_id = "Selecciona una especie.";
  }

  if (!values.breed_id) {
    errors.breed_id = "Selecciona una raza.";
  }

  if (!values.sex) {
    errors.sex = "Selecciona el sexo.";
  }

  if (!values.birth_date) {
    errors.birth_date = "Ingresa la fecha de nacimiento.";
  }

  if (!values.weight) {
    errors.weight = "Ingresa el peso.";
  } else if (Number(values.weight) <= 0) {
    errors.weight = "El peso debe ser mayor que cero.";
  }

  return errors;
}

function getOwnerName(owner: Owner) {
  return [owner.first_name, owner.last_name].filter(Boolean).join(" ");
}

export function PatientForm({
  patient,
  owners,
  species,
  breeds,
  initialOwnerId = "",
  mode,
  isSaving,
  error,
  onSpeciesChange,
  onSubmit,
}: PatientFormProps) {
  const initialValues = useMemo<PatientFormValues>(
    () =>
      patient
        ? {
            owner_id: String(patient.owner.id),
            name: patient.name,
            species_id: String(patient.species.id),
            breed_id: patient.breed ? String(patient.breed.id) : "",
            sex: patient.sex,
            birth_date: patient.birth_date ?? "",
            weight: patient.weight ? String(patient.weight) : "",
          }
        : emptyValues,
    [patient]
  );

  const [values, setValues] = useState<PatientFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!patient && initialOwnerId) {
      setValues((current) => ({ ...current, owner_id: initialOwnerId }));
    }
  }, [initialOwnerId, patient]);

  useEffect(() => {
    if (values.species_id) {
      onSpeciesChange(Number(values.species_id));
    }
  }, [onSpeciesChange, values.species_id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(normalizePayload(values));
  }

  function updateField(field: keyof PatientFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === "species_id" ? { breed_id: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <AlertMessage message={error} tone="error" /> : null}

      <Card className="p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-violet-50 text-[#4635D3]">
            <PawPrint size={24} />
          </span>
          <h2 className="text-xl font-extrabold text-[#172554]">Informacion del paciente</h2>
        </div>

        <div className="mb-7 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-700">
          <Info className="mt-0.5 shrink-0" size={18} />
          <span>Para registrar un paciente, primero debes seleccionar un propietario existente.</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          <FormSelect
            error={errors.owner_id}
            label="Propietario"
            onChange={(event) => updateField("owner_id", event.target.value)}
            required
            value={values.owner_id}
          >
            <option value="">Buscar y seleccionar propietario</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {getOwnerName(owner)}
              </option>
            ))}
          </FormSelect>

          <FormField
            error={errors.name}
            label="Nombre del paciente"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ej. Max, Luna, Rocky"
            required
            value={values.name}
          />

          <FormSelect
            error={errors.species_id}
            label="Especie"
            onChange={(event) => updateField("species_id", event.target.value)}
            required
            value={values.species_id}
          >
            <option value="">Selecciona una especie</option>
            {species.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            disabled={!values.species_id}
            error={errors.breed_id}
            label="Raza"
            onChange={(event) => updateField("breed_id", event.target.value)}
            required
            value={values.breed_id}
          >
            <option value="">Selecciona una raza</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            error={errors.sex}
            label="Sexo"
            onChange={(event) => updateField("sex", event.target.value)}
            required
            value={values.sex}
          >
            <option value="">Selecciona el sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </FormSelect>

          <FormField
            error={errors.birth_date}
            label="Fecha de nacimiento"
            onChange={(event) => updateField("birth_date", event.target.value)}
            required
            type="date"
            value={values.birth_date}
          />

          <FormField
            error={errors.weight}
            label="Peso (kg)"
            min="0"
            onChange={(event) => updateField("weight", event.target.value)}
            placeholder="Ej. 12.5"
            required
            step="0.1"
            type="number"
            value={values.weight}
          />
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#3026A6] shadow-sm transition hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-[#4635D3]/30"
          to="/patients"
        >
          Cancelar
        </Link>
        <Button disabled={isSaving} icon={<Save size={19} />} type="submit">
          {isSaving ? "Guardando..." : mode === "create" ? "Guardar paciente" : "Guardar cambios"}
        </Button>
      </div>

      <p className="text-sm font-medium text-slate-500">
        <span className="text-red-500">*</span> Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios.
      </p>
    </form>
  );
}
