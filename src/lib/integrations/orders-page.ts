import "server-only";
import { COMMANDE_BACKEND_URL } from "./orders-sync";

// Retrouve l'adresse de la page de commande d'un commerçant auprès de
// l'application de commande (la liaison ne garde pas ce nom côté KeepMe).
// Ne lève jamais d'erreur. Le résultat distingue « page introuvable » (elle n'a
// jamais été créée ou a été supprimée : on peut en proposer une nouvelle) d'une
// panne passagère (on invite à réessayer, sans rien proposer de destructeur).
export type OrdersPage =
  | { status: "found"; slug: string }
  | { status: "missing" }
  | { status: "error" };

export async function fetchOrdersPage(merchantId: string): Promise<OrdersPage> {
  const secret = process.env.HANDOFF_SECRET;
  if (!secret) return { status: "error" };
  try {
    const response = await fetch(
      `${COMMANDE_BACKEND_URL}/api/integrations/restaurant?merchantId=${encodeURIComponent(merchantId)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
        signal: AbortSignal.timeout(4_000),
      },
    );
    if (response.status === 404) return { status: "missing" };
    if (!response.ok) return { status: "error" };
    const result = (await response.json()) as { slug?: string };
    return result.slug ? { status: "found", slug: result.slug } : { status: "error" };
  } catch (error) {
    console.error("Orders slug lookup failed", error);
    return { status: "error" };
  }
}
