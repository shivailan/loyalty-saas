"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { brandingSchema, type BrandingInput } from "@/lib/validations/branding";

export async function saveBrandingColors(
  input: BrandingInput,
): Promise<{ error: string | null }> {
  const parsed = brandingSchema.safeParse(input);
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
    .update({
      primary_color: parsed.data.primaryColor,
      secondary_color: parsed.data.secondaryColor,
    })
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/branding");
  return { error: null };
}
