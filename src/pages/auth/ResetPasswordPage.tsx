import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import { Button } from "../../components/common/Button";
import { FormField } from "../../components/common/FormField";
import { authService } from "../../services/auth.service";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail ?? "No fue posible restablecer la contrasena.";
  }

  return "No fue posible restablecer la contrasena.";
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [values, setValues] = useState<FormValues>({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("El enlace de recuperacion es invalido o incompleto.");
      return;
    }
    if (values.newPassword.length < 8) {
      setError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.resetPassword({ token, new_password: values.newPassword });
      setSuccess(response.message);
      window.setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#F6F9FF] px-4 py-6">
      <section className="w-full max-w-[460px] rounded-2xl border border-white/85 bg-white px-6 py-8 shadow-[0_22px_58px_rgba(35,47,91,0.12)] sm:px-9">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-[#4635D3] text-[#4635D3]">
            <KeyRound size={30} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-[#172554]">Restablecer contrasena</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Define una nueva contrasena para recuperar el acceso.</p>
        </div>

        {error ? <AlertMessage message={error} tone="error" onClose={() => setError("")} /> : null}
        {success ? <AlertMessage message={success} onClose={() => setSuccess("")} /> : null}

        {!success ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              label="Nueva contrasena"
              minLength={8}
              onChange={(event) => setValues((current) => ({ ...current, newPassword: event.target.value }))}
              required
              type="password"
              value={values.newPassword}
            />
            <FormField
              label="Confirmar nueva contrasena"
              minLength={8}
              onChange={(event) => setValues((current) => ({ ...current, confirmPassword: event.target.value }))}
              required
              type="password"
              value={values.confirmPassword}
            />
            <Button className="w-full" disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} type="submit">
              {isSubmitting ? "Restableciendo..." : "Restablecer contrasena"}
            </Button>
          </form>
        ) : null}

        <Link className="mt-5 block text-center text-sm font-extrabold text-[#4635D3]" to="/login">
          Volver al inicio de sesion
        </Link>
      </section>
    </main>
  );
}
