"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { joinSchema, type JoinInput } from "@/lib/validations/join";
import { sendWelcomeEmail } from "@/lib/email/send";
import { allowAction, getClientFingerprint } from "@/lib/rate-limit";
import { isMerchantOpen } from "@/lib/billing/access";
import { findOrCreateCard } from "@/lib/loyalty/enroll";

// Limites par heure : large pour ne jamais gêner un vrai commerce (tous les
// clients peuvent s'inscrire depuis le même wifi), mais bloquante pour un robot.
const MAX_SIGNUPS_PER_IP_PER_HOUR = 30;
const MAX_SIGNUPS_PER_MERCHANT_PER_HOUR = 200;

export async function joinLoyaltyProgram(
  slug: string,
  input: JoinInput,
): Promise<{ error: string | null; cardId?: string }> {
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  if (parsed.data.website) {
    return { error: "Une erreur est survenue." };
  }

  const ipAllowed = await allowAction(
    `join:ip:${await getClientFingerprint()}`,
    MAX_SIGNUPS_PER_IP_PER_HOUR,
    3600,
  );
  if (!ipAllowed) {
    return {
      error:
        "Trop d'inscriptions depuis votre connexion. Réessayez dans un moment.",
    };
  }

  const supabase = createAdminClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select(
      "id, name, send_welcome_email, is_suspended, billing_exempt, subscription_status",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (!merchant) {
    return { error: "Commerçant introuvable." };
  }
  if (!isMerchantOpen(merchant)) {
    return {
      error: "Ce commerçant n'accepte plus de nouvelles inscriptions pour le moment.",
    };
  }

  const merchantAllowed = await allowAction(
    `join:merchant:${merchant.id}`,
    MAX_SIGNUPS_PER_MERCHANT_PER_HOUR,
    3600,
  );
  if (!merchantAllowed) {
    return {
      error:
        "Ce commerce reçoit beaucoup d'inscriptions en ce moment. Réessayez dans quelques minutes.",
    };
  }

  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("id")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!program) {
    return {
      error: "Ce commerçant n'a pas encore activé de programme de fidélité.",
    };
  }

  const enrolled = await findOrCreateCard(supabase, {
    merchantId: merchant.id,
    programId: program.id,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    marketingConsent: parsed.data.marketingConsent,
  });
  if (enrolled.error !== null) {
    return { error: enrolled.error };
  }
  const { cardId, isNewCustomer } = enrolled;

  if (isNewCustomer && merchant.send_welcome_email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendWelcomeEmail({
      to: parsed.data.email,
      customerFirstName: parsed.data.firstName,
      merchantName: merchant.name,
      cardUrl: `${siteUrl}/card/${cardId}`,
    });
  }

  return { error: null, cardId };
}
