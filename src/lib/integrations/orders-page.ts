import "server-only";
import { COMMANDE_BACKEND_URL } from "./orders-sync";

// Retrouve l'adresse de la page de commande d'un commerçant auprès de
// l'application de commande (la liaison ne garde pas ce nom côté KeepMe).
// Ne lève jamais d'erreur : sans réponse, le tableau de bord n'affiche juste
// pas les boutons.
export async function fetchOrdersSlug(merchantId: string): Promise<string | null> {
  const secret = process.env.HANDOFF_SECRET;
  if (!secret) return null;
  try {
    const response = await fetch(
      `${COMMANDE_BACKEND_URL}/api/integrations/restaurant?merchantId=${encodeURIComponent(merchantId)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
        signal: AbortSignal.timeout(4_000),
      },
    );
    if (!response.ok) return null;
    const result = (await response.json()) as { slug?: string };
    return result.slug ?? null;
  } catch (error) {
    console.error("Orders slug lookup failed", error);
    return null;
  }
}
