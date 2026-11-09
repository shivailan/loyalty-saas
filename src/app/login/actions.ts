"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { captchaAwareError } from "@/lib/auth/captcha-error";
import { isBillingEnabled } from "@/lib/billing/config";
import { hasPaidAccess } from "@/lib/billing/access";

export async function login(
  input: LoginInput,
  captchaToken?: string,
): Promise<{ error: string | null }> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    ...parsed.data,
    options: { captchaToken },
  });

  if (error) {
    return { error: captchaAwareError(error.message) };
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminRow) redirect("/admin");

  // Compte pas encore payé : on va droit au choix de la formule, sans passer
  // par l'espace commerçant.
  if (isBillingEnabled()) {
    const { data: merchant } = await supabase
      .from("merchants")
      .select("billing_exempt, subscription_status")
      .eq("owner_id", data.user.id)
      .maybeSingle();
    if (merchant && !hasPaidAccess(merchant)) redirect("/subscribe");
  }

  redirect("/dashboard");
}
