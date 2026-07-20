"use server";

import { createClient } from "@/lib/supabase/server";
import { scanSchema } from "@/lib/validations/scan";
import { sendRewardEmail } from "@/lib/email/send";

export type AddVisitResult = {
  error: string | null;
  customerName?: string;
  currentStamps?: number;
  visitsRequired?: number;
  rewardReached?: boolean;
};

export async function addVisit(cardIdInput: string): Promise<AddVisitResult> {
  const parsed = scanSchema.safeParse({ cardId: cardIdInput });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Code invalide" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { data: card, error: fetchError } = await supabase
    .from("loyalty_cards")
    .select(
      `
      id,
      current_stamps,
      customers ( first_name, last_name, email ),
      loyalty_programs (
        visits_required,
        reward_description,
        is_active,
        merchants ( name, send_reward_email )
      )
    `,
    )
    .eq("id", parsed.data.cardId)
    .maybeSingle();

  if (fetchError || !card) {
    return {
      error: "Carte introuvable ou n'appartenant pas à votre établissement.",
    };
  }

  if (card.loyalty_programs?.is_active === false) {
    return { error: "Ce programme de fidélité est actuellement désactivé." };
  }

  const { error: insertError } = await supabase
    .from("visits")
    .insert({ card_id: card.id });
  if (insertError) {
    return { error: insertError.message };
  }

  const previousStampCount = card.current_stamps;
  const newStampCount = previousStampCount + 1;

  const { error: updateError } = await supabase
    .from("loyalty_cards")
    .update({ current_stamps: newStampCount })
    .eq("id", card.id);
  if (updateError) {
    return { error: updateError.message };
  }

  const visitsRequired = card.loyalty_programs?.visits_required ?? 0;
  const customerName = [
    card.customers?.first_name,
    card.customers?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const rewardReached =
    visitsRequired > 0 && newStampCount >= visitsRequired;
  const justCrossedThreshold =
    rewardReached && previousStampCount < visitsRequired;

  const merchant = card.loyalty_programs?.merchants;
  if (
    justCrossedThreshold &&
    merchant?.send_reward_email &&
    card.customers?.email
  ) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendRewardEmail({
      to: card.customers.email,
      customerFirstName: card.customers.first_name,
      merchantName: merchant.name,
      rewardDescription: card.loyalty_programs?.reward_description ?? "",
      cardUrl: `${siteUrl}/card/${card.id}`,
    });
  }

  return {
    error: null,
    customerName,
    currentStamps: newStampCount,
    visitsRequired,
    rewardReached,
  };
}

export type RedeemRewardResult = {
  error: string | null;
  success?: boolean;
};

export async function redeemReward(
  cardIdInput: string,
): Promise<RedeemRewardResult> {
  const parsed = scanSchema.safeParse({ cardId: cardIdInput });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Code invalide" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { data: card, error: fetchError } = await supabase
    .from("loyalty_cards")
    .select("id, current_stamps, loyalty_programs ( visits_required )")
    .eq("id", parsed.data.cardId)
    .maybeSingle();

  if (fetchError || !card) {
    return {
      error: "Carte introuvable ou n'appartenant pas à votre établissement.",
    };
  }

  const visitsRequired = card.loyalty_programs?.visits_required ?? 0;
  if (visitsRequired === 0 || card.current_stamps < visitsRequired) {
    return { error: "Le seuil de récompense n'est pas encore atteint." };
  }

  const { error: insertError } = await supabase
    .from("reward_redemptions")
    .insert({ card_id: card.id, redeemed_at: new Date().toISOString() });
  if (insertError) {
    return { error: insertError.message };
  }

  const { error: resetError } = await supabase
    .from("loyalty_cards")
    .update({ current_stamps: 0 })
    .eq("id", card.id);
  if (resetError) {
    return { error: resetError.message };
  }

  return { error: null, success: true };
}
