"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { offerSchema, type OfferInput } from "@/lib/validations/offer";
import { getOfferAudience } from "@/lib/wallet/offers";
import { notifyWalletUpdates } from "@/lib/wallet/notify";

export type SendOfferResult = { error: string | null; recipients?: number };

function formatWait(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);
  if (hours > 0) return `${hours} h ${minutes} min`;
  return `${Math.max(1, minutes)} min`;
}

export async function sendOffer(input: OfferInput): Promise<SendOfferResult> {
  const parsed = offerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Message invalide" };
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
    .eq("owner_id", user.id)
    .single();
  if (!merchant) {
    return { error: "Établissement introuvable." };
  }

  // Les limites (1 offre par 24 h, pas deux fois le même texte) sont
  // appliquées par la base de données, pas seulement par cette page.
  const { data, error: rpcError } = await supabase.rpc("send_wallet_offer", {
    p_message: parsed.data.message,
  });
  const result = data?.[0];
  if (rpcError || !result) {
    return { error: "Une erreur est survenue, veuillez réessayer." };
  }

  switch (result.status) {
    case "ok":
      break;
    case "too_soon":
      return {
        error: `Une offre a déjà été envoyée aujourd'hui. Prochain envoi possible dans ${formatWait(result.seconds_remaining)}.`,
      };
    case "same_message":
      return {
        error:
          "Ce message est identique au précédent : vos clients ne recevraient aucune notification. Modifiez-le.",
      };
    case "invalid":
      return { error: "Le message doit faire entre 3 et 100 caractères." };
    default:
      return { error: "Une erreur est survenue, veuillez réessayer." };
  }

  const audience = await getOfferAudience(merchant.id);
  await createAdminClient()
    .from("wallet_offers")
    .update({ recipients_count: audience.count })
    .eq("id", result.offer_id!);

  // Envoi des notifications une fois la réponse renvoyée au commerçant.
  after(() => notifyWalletUpdates(audience.cardIds));

  revalidatePath("/dashboard/offers");
  return { error: null, recipients: audience.count };
}
