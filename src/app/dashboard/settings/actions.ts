"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  businessNameSchema,
  type BusinessNameInput,
} from "@/lib/validations/account";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/password-reset";

export async function updateBusinessName(
  input: BusinessNameInput,
): Promise<{ error: string | null }> {
  const parsed = businessNameSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { error } = await supabase
    .from("merchants")
    .update({ name: parsed.data.businessName })
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { error: null };
}

export async function changePassword(
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
    return { error: "Vous devez être connecté." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
