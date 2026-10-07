import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGoogleWalletConfig, googleObjectId } from "./config";
import { buildObjectState } from "./card";
import { addLoyaltyMessage, patchLoyaltyObject } from "./api";
import { FALLBACK_SITE_URL, loadWalletCard } from "../load-card";

const CONCURRENCY = 10;

async function inBatches<T>(items: T[], task: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    await Promise.all(items.slice(i, i + CONCURRENCY).map(task));
  }
}

// Ne garde que les cartes réellement proposées à Google Wallet.
async function googleCardIds(cardIds: string[]): Promise<string[]> {
  const supabase = createAdminClient();
  const found = new Set<string>();
  for (let i = 0; i < cardIds.length; i += 200) {
    const { data } = await supabase
      .from("google_wallet_cards")
      .select("card_id")
      .in("card_id", cardIds.slice(i, i + 200));
    for (const row of data ?? []) found.add(row.card_id);
  }
  return [...found];
}

// Met à jour la carte Google après un passage, une annulation ou une
// récompense. Avec notify, le client reçoit aussi une notification.
// Ne lève jamais d'erreur : Google Wallet ne doit jamais faire échouer
// l'enregistrement d'un passage.
export async function syncGoogleCard(
  cardId: string,
  { notify = false }: { notify?: boolean } = {},
): Promise<void> {
  try {
    const config = getGoogleWalletConfig();
    if (!config) return;
    if ((await googleCardIds([cardId])).length === 0) return;

    const card = await loadWalletCard(cardId, FALLBACK_SITE_URL);
    if (!card) return;

    const objectId = googleObjectId(config, cardId);
    const status = await patchLoyaltyObject(
      config,
      objectId,
      buildObjectState(card.data),
    );
    if (notify && status === 200) {
      await addLoyaltyMessage(config, objectId, {
        id: `visit-${Date.now()}`,
        header: card.data.merchantName,
        body: `Passages : ${card.data.stamps} sur ${card.data.required}`,
      });
    }
  } catch (error) {
    console.error("Google Wallet sync failed:", error);
  }
}

// Envoie une offre en notification aux clients Android concernés.
export async function sendGoogleOffer(
  cardIds: string[],
  offer: { id: string; merchantName: string; message: string },
): Promise<void> {
  try {
    const config = getGoogleWalletConfig();
    if (!config || cardIds.length === 0) return;
    const targets = await googleCardIds(cardIds);
    await inBatches(targets, async (cardId) => {
      await addLoyaltyMessage(config, googleObjectId(config, cardId), {
        id: `offer-${offer.id}`,
        header: offer.merchantName,
        body: offer.message,
      });
    });
  } catch (error) {
    console.error("Google Wallet offer failed:", error);
  }
}
