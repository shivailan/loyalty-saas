import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Adresse interne de l'application de commande. Les visiteurs ne la voient
// jamais : le site unique (www) leur sert ses pages sous ses propres adresses.
export const COMMANDE_BACKEND_URL = (
  process.env.COMMANDE_BACKEND_URL ?? "https://commande.keepmecard.fr"
).replace(/\/$/, "");

// Statuts Stripe pour lesquels la page de commande reste en ligne : mêmes
// règles que l'accès au tableau de bord (un prélèvement refusé laisse quelques
// jours de grâce pendant que Stripe réessaie).
const LIVE_STATUSES = ["active", "trialing", "past_due"];

// Traduit un statut Stripe pour l'application de commande, qui ne connaît que
// « en ligne » (active) ou non.
export function ordersStatusFor(status: string): string {
  return LIVE_STATUSES.includes(status) ? "active" : status;
}

// Prévient l'application de commande que l'abonnement d'un commerçant a changé,
// pour que sa page de commande soit publiée ou retirée en conséquence. Ne lève
// jamais d'erreur : un échec ici ne doit pas faire échouer le webhook Stripe.
// Sans lien (commerçant sans page de commande), il n'y a rien à faire.
export async function pushSubscriptionToOrders(
  merchantId: string,
  status: string,
): Promise<void> {
  try {
    const secret = process.env.HANDOFF_SECRET;
    if (!secret) return;
    const { data } = await createAdminClient()
      .from("merchants")
      .select("integration_key_hint")
      .eq("id", merchantId)
      .maybeSingle();
    if (!data?.integration_key_hint) return;

    const response = await fetch(`${COMMANDE_BACKEND_URL}/api/integrations/subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ merchantId, status: ordersStatusFor(status) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) console.error("Orders sync refused", response.status);
  } catch (error) {
    console.error("Orders sync failed", error);
  }
}
