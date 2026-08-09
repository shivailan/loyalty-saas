"use server";

import { createClient } from "@/lib/supabase/server";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/password-reset";

export async function updatePassword(
  input: ResetPasswordInput,
): Promise<{ error: string | null }> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Lien expiré ou invalide. Refaites une demande de réinitialisation.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
