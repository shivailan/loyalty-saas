import { allowAction, fingerprint } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGoogleWalletConfig, googleObjectId } from "@/lib/wallet/google/config";
import { buildSaveUrl } from "@/lib/wallet/google/auth";
import { buildLoyaltyClass, buildLoyaltyObject } from "@/lib/wallet/google/card";
import {
  upsertLoyaltyClass,
  upsertLoyaltyObject,
} from "@/lib/wallet/google/api";
import {
  UUID_PATTERN,
  loadWalletCard,
  resolveSiteUrl,
} from "@/lib/wallet/load-card";

export const runtime = "nodejs";

// Prépare la carte côté Google puis redirige le client vers « Ajouter à
// Google Wallet ».
export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  const { cardId } = await params;

  const config = getGoogleWalletConfig();
  if (!config || !UUID_PATTERN.test(cardId)) {
    return new Response("Not found", { status: 404 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const allowed = await allowAction(
    `wallet-google:${fingerprint(ip)}`,
    30,
    60 * 60,
  );
  if (!allowed) {
    return new Response("Too many requests", { status: 429 });
  }

  const card = await loadWalletCard(cardId, resolveSiteUrl(request));
  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  try {
    await upsertLoyaltyClass(config, buildLoyaltyClass(config, card.data));
    await upsertLoyaltyObject(config, buildLoyaltyObject(config, card.data));
    await createAdminClient()
      .from("google_wallet_cards")
      .upsert({ card_id: cardId });
    return Response.redirect(
      buildSaveUrl(config, googleObjectId(config, cardId)),
      302,
    );
  } catch (error) {
    console.error("Google Wallet save failed:", error);
    return new Response("Google Wallet indisponible, réessayez plus tard.", {
      status: 502,
    });
  }
}
