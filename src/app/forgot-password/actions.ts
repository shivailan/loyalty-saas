"use server";

import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/password-reset";

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<{ error: string | null }> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // On ignore volontairement le résultat : le message affiché à l'utilisateur
  // est toujours le même, que l'email existe ou non (anti-énumération).
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return { error: null };
}
