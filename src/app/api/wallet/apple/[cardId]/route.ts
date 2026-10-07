import { allowAction, fingerprint } from "@/lib/rate-limit";
import { getWalletCertificates } from "@/lib/wallet/config";
import { buildApplePass } from "@/lib/wallet/apple-pass";
import {
  UUID_PATTERN,
  loadWalletCard,
  resolveSiteUrl,
} from "@/lib/wallet/load-card";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  const { cardId } = await params;

  const certificates = getWalletCertificates();
  if (!certificates || !UUID_PATTERN.test(cardId)) {
    return new Response("Not found", { status: 404 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const allowed = await allowAction(`wallet:${fingerprint(ip)}`, 30, 60 * 60);
  if (!allowed) {
    return new Response("Too many requests", { status: 429 });
  }

  const card = await loadWalletCard(cardId, resolveSiteUrl(request));
  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const buffer = await buildApplePass(card.data, certificates);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="keepme-${card.data.cardId.slice(0, 8)}.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Apple pass generation failed:", error);
    return new Response("Pass generation failed", { status: 500 });
  }
}
