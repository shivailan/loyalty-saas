"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateIntegrationKey } from "@/lib/integrations/key";
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

// Génère (ou remplace) la clé qui relie Qtime à ce commerce. La clé complète
// n'est renvoyée qu'ici, une seule fois : seule son empreinte est conservée.
export async function createIntegrationKey(): Promise<{
  error: string | null;
  key?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { key, hash, hint } = generateIntegrationKey();
  const { error } = await createAdminClient()
    .from("merchants")
    .update({
      integration_key_hash: hash,
      integration_key_hint: hint,
      integration_key_created_at: new Date().toISOString(),
    })
    .eq("owner_id", user.id);
  if (error) {
    return { error: "Impossible de créer la clé. Réessayez." };
  }

  revalidatePath("/dashboard/settings");
  return { error: null, key };
}

export async function revokeIntegrationKey(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { error } = await createAdminClient()
    .from("merchants")
    .update({
      integration_key_hash: null,
      integration_key_hint: null,
      integration_key_created_at: null,
    })
    .eq("owner_id", user.id);
  if (error) {
    return { error: "Impossible de supprimer la clé. Réessayez." };
  }

  revalidatePath("/dashboard/settings");
  return { error: null };
}
