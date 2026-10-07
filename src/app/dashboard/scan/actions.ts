"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scanSchema } from "@/lib/validations/scan";
import { sendRewardEmail } from "@/lib/email/send";
import { notifyWalletUpdate } from "@/lib/wallet/notify";

// Délai minimum entre deux passages d'une même carte (anti double scan) et
// durée pendant laquelle le dernier passage peut être annulé.
const SCAN_COOLDOWN_SECONDS = 120;
const UNDO_WINDOW_SECONDS = 600;

const NOT_FOUND_MESSAGE =
  "Carte introuvable ou n'appartenant pas à votre établissement.";
const GENERIC_ERROR_MESSAGE = "Une erreur est survenue, veuillez réessayer.";

export type AddVisitResult = {
  error: string | null;
  tooSoon?: boolean;
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

  const { data, error: rpcError } = await supabase.rpc("add_visit", {
    p_card_id: parsed.data.cardId,
    p_cooldown_seconds: SCAN_COOLDOWN_SECONDS,
  });
  const visit = data?.[0];
  if (rpcError || !visit) {
    return { error: GENERIC_ERROR_MESSAGE };
  }

  if (visit.status === "not_found") {
    return { error: NOT_FOUND_MESSAGE };
  }
  if (visit.status === "inactive") {
    return { error: "Ce programme de fidélité est actuellement désactivé." };
  }
  if (visit.status === "too_soon") {
    return {
      error: `Ce client vient déjà d'être tamponné. Nouveau passage possible dans ${visit.seconds_remaining} seconde${visit.seconds_remaining > 1 ? "s" : ""}.`,
      tooSoon: true,
    };
  }

  // Rafraîchit la carte dans le Wallet du client, une fois la réponse envoyée.
  after(() => notifyWalletUpdate(parsed.data.cardId));

  const previousStampCount = visit.previous_stamps;
  const newStampCount = visit.new_stamps;

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select(
      `
      id,
      customers ( first_name, last_name, email ),
      loyalty_programs (
        visits_required,
        reward_description,
        merchants ( name, send_reward_email )
      )
    `,
    )
    .eq("id", parsed.data.cardId)
    .maybeSingle();

  const visitsRequired = card?.loyalty_programs?.visits_required ?? 0;
  const customerName = [
    card?.customers?.first_name,
    card?.customers?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const rewardReached = visitsRequired > 0 && newStampCount >= visitsRequired;
  const justCrossedThreshold =
    rewardReached && previousStampCount < visitsRequired;

  const merchant = card?.loyalty_programs?.merchants;
  if (
    card &&
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

export type UndoVisitResult = {
  error: string | null;
  currentStamps?: number;
};

export async function undoLastVisit(
  cardIdInput: string,
): Promise<UndoVisitResult> {
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

  const { data, error: rpcError } = await supabase.rpc("undo_last_visit", {
    p_card_id: parsed.data.cardId,
    p_window_seconds: UNDO_WINDOW_SECONDS,
  });
  const result = data?.[0];
  if (rpcError || !result) {
    return { error: GENERIC_ERROR_MESSAGE };
  }

  switch (result.status) {
    case "ok":
      after(() => notifyWalletUpdate(parsed.data.cardId));
      return { error: null, currentStamps: result.new_stamps };
    case "not_found":
      return { error: NOT_FOUND_MESSAGE };
    case "no_visit":
      return { error: "Aucun passage à annuler sur cette carte." };
    case "too_old":
      return {
        error: `Ce passage date de plus de ${UNDO_WINDOW_SECONDS / 60} minutes, il ne peut plus être annulé.`,
      };
    case "reward_given":
      return {
        error:
          "Une récompense a été remise depuis ce passage, il ne peut plus être annulé.",
      };
    default:
      return { error: GENERIC_ERROR_MESSAGE };
  }
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

  const { data, error: rpcError } = await supabase.rpc("redeem_reward", {
    p_card_id: parsed.data.cardId,
  });
  const result = data?.[0];
  if (rpcError || !result) {
    return { error: GENERIC_ERROR_MESSAGE };
  }

  switch (result.status) {
    case "ok":
      after(() => notifyWalletUpdate(parsed.data.cardId));
      return { error: null, success: true };
    case "not_found":
      return { error: NOT_FOUND_MESSAGE };
    case "not_reached":
      return { error: "Le seuil de récompense n'est pas encore atteint." };
    default:
      return { error: GENERIC_ERROR_MESSAGE };
  }
}
