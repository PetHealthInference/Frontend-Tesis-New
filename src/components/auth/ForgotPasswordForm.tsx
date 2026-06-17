import { Info, Loader2, Mail, Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { AlertMessage } from "../common/AlertMessage";
import { Button } from "../common/Button";
import { authService } from "../../services/auth.service";

type ForgotPasswordFormProps = {
  onBack: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail ?? "No fue posible enviar las instrucciones.";
  }

  return "No fue posible enviar las instrucciones.";
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!emailPattern.test(email.trim())) {
      setError("Ingresa un correo electronico valido.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.forgotPassword({ email: email.trim() });
      setSuccess("Si el correo existe, recibiras instrucciones de recuperacion.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-9 text-center">
        <h2 className="text-3xl font-extrabold text-[#172554] sm:text-[2.2rem]">Recuperar contrasena</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          Ingresa tu correo y te enviaremos instrucciones si existe una cuenta asociada.
        </p>
      </div>

      {error ? <AlertMessage message={error} tone="error" onClose={() => setError("")} /> : null}
      {success ? <AlertMessage message={success} onClose={() => setSuccess("")} /> : null}

      <form className="mt-6 space-y-7" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-base font-extrabold text-slate-700">Correo electronico</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input
              className="h-[4.35rem] w-full rounded-xl border border-slate-200 bg-white pl-16 pr-5 text-xl font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#4635D3] focus:ring-4 focus:ring-[#4635D3]/10 sm:text-[1.28rem]"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Ingresa tu correo electronico"
              type="email"
              value={email}
            />
          </span>
        </label>

        <Button className="h-[4.35rem] w-full rounded-xl text-xl shadow-[0_14px_28px_rgba(70,53,211,0.22)]" disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="animate-spin" size={21} /> : <Send size={21} />} type="submit">
          {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
        </Button>
      </form>

      <button
        className="mt-7 w-full rounded-lg px-4 py-3 text-center text-xl font-extrabold text-[#4635D3] transition hover:bg-violet-50"
        onClick={onBack}
        type="button"
      >
        Volver al inicio de sesion
      </button>

      <div className="mt-7 flex items-start gap-4 border-t border-slate-100 pt-7 text-sm font-semibold leading-6 text-slate-500">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-50 text-[#4635D3]">
          <Info size={21} />
        </span>
        <span>Si el correo esta registrado, se enviaran instrucciones de recuperacion.</span>
      </div>
    </div>
  );
}
