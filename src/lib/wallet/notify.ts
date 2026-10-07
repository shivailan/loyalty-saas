import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWalletCertificates } from "./config";
import { sendWalletPushes } from "./apns";

// À appeler après toute modification de cartes : prévient les iPhones qui
// ont ces cartes dans Wallet pour qu'ils les rafraîchissent. Ne lève jamais
// d'erreur : la mise à jour de Wallet ne doit jamais faire échouer
// l'enregistrement d'un passage ou l'envoi d'une offre.
export async function notifyWalletUpdates(cardIds: string[]): Promise<void> {
  try {
    if (cardIds.length === 0) return;
    const certificates = getWalletCertificates();
    if (!certificates) return;

    const supabase = createAdminClient();
    const tokens = new Set<string>();
    // Lecture par paquets pour rester sous la limite de taille d'URL.
    for (let i = 0; i < cardIds.length; i += 200) {
      const { data } = await supabase
        .from("wallet_registrations")
        .select("push_token")
        .in("card_id", cardIds.slice(i, i + 200));
      for (const row of data ?? []) tokens.add(row.push_token);
    }
    if (tokens.size === 0) return;

    const results = await sendWalletPushes([...tokens], certificates);

    // 410 = Apple dit que l'appareil ne reçoit plus de notifications pour
    // cette carte : on oublie ce jeton.
    const gone = results.filter((r) => r.status === 410).map((r) => r.token);
    if (gone.length > 0) {
      await supabase.from("wallet_registrations").delete().in("push_token", gone);
    }
  } catch (error) {
    console.error("Wallet update notification failed:", error);
  }
}

export function notifyWalletUpdate(cardId: string): Promise<void> {
  return notifyWalletUpdates([cardId]);
}
