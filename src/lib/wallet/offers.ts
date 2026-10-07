import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Cartes d'un commerçant qui peuvent recevoir une offre : client ayant accepté
// les offres ET carte ajoutée à un Wallet (au moins un appareil enregistré).
// La lecture passe par le client admin car la table des appareils n'est pas
// accessible aux commerçants ; elle est strictement limitée à leur commerce.
export async function getOfferAudience(merchantId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("wallet_registrations")
    .select(
      "card_id, loyalty_cards!inner ( customers!inner ( merchant_id, marketing_consent ) )",
    )
    .eq("loyalty_cards.customers.merchant_id", merchantId)
    .eq("loyalty_cards.customers.marketing_consent", true);

  const cardIds = [...new Set((data ?? []).map((row) => row.card_id))];
  return { cardIds, count: cardIds.length };
}
