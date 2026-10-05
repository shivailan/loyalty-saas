"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { joinSchema, type JoinInput } from "@/lib/validations/join";
import { sendWelcomeEmail } from "@/lib/email/send";
import { allowAction, getClientFingerprint } from "@/lib/rate-limit";

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
    .select("id, name, send_welcome_email, is_suspended")
    .eq("slug", slug)
    .maybeSingle();
  if (!merchant) {
    return { error: "Commerçant introuvable." };
  }
  if (merchant.is_suspended) {
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

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("merchant_id", merchant.id)
    .eq("email", parsed.data.email)
    .maybeSingle();

  let customerId = existingCustomer?.id as string | undefined;
  const isNewCustomer = !customerId;

  if (!customerId) {
    const { data: newCustomer, error } = await supabase
      .from("customers")
      .insert({
        merchant_id: merchant.id,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        marketing_consent: parsed.data.marketingConsent,
        marketing_consent_at: parsed.data.marketingConsent
          ? new Date().toISOString()
          : null,
      })
      .select("id")
      .single();
    if (error) {
      return { error: error.message };
    }
    customerId = newCustomer.id;
  }

  const { data: existingCard } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("customer_id", customerId)
    .eq("loyalty_program_id", program.id)
    .maybeSingle();

  let cardId = existingCard?.id as string | undefined;

  if (!cardId) {
    const { data: newCard, error } = await supabase
      .from("loyalty_cards")
      .insert({
        customer_id: customerId,
        loyalty_program_id: program.id,
      })
      .select("id")
      .single();
    if (error) {
      return { error: error.message };
    }
    cardId = newCard.id;
  }

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
