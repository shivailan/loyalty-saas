import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Jeton secret propre à chaque carte, que l'iPhone nous renvoie pour prouver
// qu'il possède bien la carte. Dérivé de la clé serveur : rien à stocker.
export function walletAuthToken(cardId: string): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
    .update(`wallet-pass:${cardId}`)
    .digest("hex");
}

// Apple envoie l'en-tête « Authorization: ApplePass <jeton> ».
export function isWalletRequestAuthorized(
  request: Request,
  cardId: string,
): boolean {
  const header = request.headers.get("authorization") ?? "";
  const received = Buffer.from(header.replace(/^ApplePass /, ""));
  const expected = Buffer.from(walletAuthToken(cardId));
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
