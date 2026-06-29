import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import type { PasswordResetEmailPayload } from "../types/auth";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

function assertEmailJsConfig() {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("EmailJS no esta configurado. Define VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID y VITE_EMAILJS_PUBLIC_KEY.");
  }
}

function getEmailJsErrorMessage(error: unknown) {
  if (error instanceof EmailJSResponseStatus) {
    return `EmailJS rechazo el envio (${error.status}): ${error.text}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible enviar el correo de recuperacion mediante EmailJS.";
}

export const emailJsService = {
  async sendPasswordReset(payload: PasswordResetEmailPayload) {
    assertEmailJsConfig();

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: payload.to_email,
          to_name: payload.to_name,
          user_name: payload.to_name,
          reset_url: payload.reset_url,
          reset_token: payload.reset_token,
          verification_code: payload.reset_token,
          expires_minutes: payload.expires_minutes,
          app_name: "VetClinic OE3",
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
    } catch (error) {
      throw new Error(getEmailJsErrorMessage(error));
    }
  },
};
