"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  loyaltyProgramSchema,
  type LoyaltyProgramInput,
} from "@/lib/validations/loyalty-program";

export async function saveProgram(
  input: LoyaltyProgramInput,
): Promise<{ error: string | null }> {
  const parsed = loyaltyProgramSchema.safeParse(input);
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

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id")
    .single();
  if (!merchant) {
    return { error: "Établissement introuvable." };
  }

  const { data: existingProgram } = await supabase
    .from("loyalty_programs")
    .select("id")
    .eq("merchant_id", merchant.id)
    .maybeSingle();

  const payload = {
    name: parsed.data.name,
    visits_required: parsed.data.visitsRequired,
    reward_description: parsed.data.rewardDescription,
    is_active: parsed.data.isActive,
  };

  const { error } = existingProgram
    ? await supabase
        .from("loyalty_programs")
        .update(payload)
        .eq("id", existingProgram.id)
    : await supabase
        .from("loyalty_programs")
        .insert({ ...payload, merchant_id: merchant.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/program");
  return { error: null };
}
