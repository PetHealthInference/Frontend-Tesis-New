import { Save, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertMessage } from "../common/AlertMessage";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { FormField } from "../common/FormField";
import type { Owner, OwnerFormValues, OwnerPayload } from "../../types/owner";

type OwnerFormProps = {
  owner?: Owner;
  isSaving: boolean;
  error?: string;
  mode: "create" | "edit";
  onCancel?: () => void;
  onSubmit: (payload: OwnerPayload) => Promise<void>;
};

type FormErrors = Partial<Record<keyof OwnerFormValues, string>>;

const emptyValues: OwnerFormValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
};

function normalizePayload(values: OwnerFormValues): OwnerPayload {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim() || null,
    phone: values.phone.trim() || null,
    email: values.email.trim() || null,
    address: values.address.trim() || null,
  };
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+\s()-]/g, "");
}

function validate(values: OwnerFormValues): FormErrors {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (values.first_name.trim().length < 2) {
    errors.first_name = "Ingresa al menos 2 caracteres.";
  }

  if (!values.last_name.trim()) {
    errors.last_name = "Ingresa los apellidos del propietario.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Ingresa un telefono de contacto.";
  } else if (values.phone.trim().length > 20) {
    errors.phone = "El telefono no debe superar 20 caracteres.";
  }

  if (!values.email.trim()) {
    errors.email = "Ingresa un correo electronico.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Ingresa un correo electronico valido.";
  }

  if (!values.address.trim()) {
    errors.address = "Ingresa la direccion completa.";
  }

  return errors;
}

export function OwnerForm({ owner, mode, isSaving, error, onCancel, onSubmit }: OwnerFormProps) {
  const initialValues = useMemo<OwnerFormValues>(
    () =>
      owner
        ? {
            first_name: owner.first_name ?? "",
            last_name: owner.last_name ?? "",
            phone: owner.phone ?? "",
            email: owner.email ?? "",
            address: owner.address ?? "",
          }
        : emptyValues,
    [owner]
  );

  const [values, setValues] = useState<OwnerFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(normalizePayload(values));
  }

  function updateField(field: keyof OwnerFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: field === "phone" ? normalizePhone(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <AlertMessage message={error} tone="error" /> : null}

      <Card className="p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-violet-50 text-[#4635D3]">
            <UserRound size={24} />
          </span>
          <h2 className="text-xl font-extrabold text-[#172554]">Informacion del propietario</h2>
        </div>

        <div className="grid gap-7 lg:grid-cols-2">
          <FormField
            error={errors.first_name}
            label="Nombres"
            onChange={(event) => updateField("first_name", event.target.value)}
            placeholder="Ej. Maria Elena"
            required
            value={values.first_name}
          />
          <FormField
            error={errors.last_name}
            label="Apellidos"
            onChange={(event) => updateField("last_name", event.target.value)}
            placeholder="Ej. Garcia Lopez"
            required
            value={values.last_name}
          />
          <FormField
            error={errors.address}
            helpText="Ingresa la direccion completa."
            label="Direccion"
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Ej. Av. Siempreviva 742"
            required
            value={values.address}
          />
          <FormField
            error={errors.phone}
            helpText="Incluye codigo de pais y/o ciudad."
            inputMode="tel"
            label="Telefono"
            maxLength={20}
            onBeforeInput={(event) => {
              const data = (event.nativeEvent as InputEvent).data;

              if (data && /[a-zA-Z]/.test(data)) {
                event.preventDefault();
              }
            }}
            onChange={(event) => updateField("phone", event.target.value)}
            pattern="[0-9+\s()-]*"
            placeholder="Ej. +51 999 000 111"
            required
            type="tel"
            value={values.phone}
          />
          <div className="lg:col-span-2">
            <FormField
              error={errors.email}
              helpText="Se usara para contacto del propietario."
              label="Correo electronico"
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Ej. maria.garcia@email.com"
              required
              type="email"
              value={values.email}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancelar
          </Button>
        ) : (
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#3026A6] shadow-sm transition hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-[#4635D3]/30"
            to="/owners"
          >
            Cancelar
          </Link>
        )}
        <Button disabled={isSaving} icon={<Save size={19} />} type="submit">
          {isSaving ? "Guardando..." : mode === "create" ? "Guardar propietario" : "Guardar cambios"}
        </Button>
      </div>

      <p className="text-sm font-medium text-slate-500">
        <span className="text-red-500">*</span> Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios.
      </p>
    </form>
  );
}
