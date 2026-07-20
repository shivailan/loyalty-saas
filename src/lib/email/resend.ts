import "server-only";
import { Resend } from "resend";

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export const EMAIL_FROM = "Fidelio <onboarding@resend.dev>";
