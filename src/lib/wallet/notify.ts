import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWalletCertificates } from "./config";
import { sendWalletPushes } from "./apns";

// À appeler après toute modification des passages d'une carte : prévient les
// iPhones qui ont cette carte dans Wallet pour qu'ils la rafraîchissent.
// Ne lève jamais d'erreur : la mise à jour de Wallet ne doit jamais faire
// échouer l'enregistrement d'un passage.
export async function notifyWalletUpdate(cardId: string): Promise<void> {
  try {
    const certificates = getWalletCertificates();
    if (!certificates) return;

    const supabase = createAdminClient();
    const { data } = await supabase
      .from("wallet_registrations")
      .select("push_token")
      .eq("card_id", cardId);
    const tokens = [...new Set((data ?? []).map((row) => row.push_token))];
    if (tokens.length === 0) return;

    const results = await sendWalletPushes(tokens, certificates);

    // 410 = Apple dit que l'appareil ne reçoit plus de notifications pour
    // cette carte : on oublie ce jeton.
    const gone = results.filter((r) => r.status === 410).map((r) => r.token);
    if (gone.length > 0) {
      await supabase
        .from("wallet_registrations")
        .delete()
        .eq("card_id", cardId)
        .in("push_token", gone);
    }
  } catch (error) {
    console.error("Wallet update notification failed:", error);
  }
}
