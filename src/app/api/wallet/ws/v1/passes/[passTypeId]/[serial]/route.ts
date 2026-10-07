import { getWalletCertificates, PASS_TYPE_ID } from "@/lib/wallet/config";
import { buildApplePass } from "@/lib/wallet/apple-pass";
import { isWalletRequestAuthorized } from "@/lib/wallet/auth";
import {
  UUID_PATTERN,
  loadWalletCard,
  resolveSiteUrl,
} from "@/lib/wallet/load-card";

export const runtime = "nodejs";

// L'iPhone télécharge ici la dernière version de la carte après une
// notification. 304 si elle n'a pas changé depuis sa dernière demande.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ passTypeId: string; serial: string }> },
) {
  const { passTypeId, serial } = await params;
  const certificates = getWalletCertificates();
  if (
    !certificates ||
    passTypeId !== PASS_TYPE_ID ||
    !UUID_PATTERN.test(serial)
  ) {
    return new Response("Not found", { status: 404 });
  }
  if (!isWalletRequestAuthorized(request, serial)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const card = await loadWalletCard(serial, resolveSiteUrl(request));
  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  // Les dates HTTP n'ont pas de précision sous la seconde : on arrondit
  // vers le haut pour ne jamais répondre 304 à tort.
  const lastModified = new Date(
    Math.ceil(new Date(card.updatedAt).getTime() / 1000) * 1000,
  );
  const ifModifiedSince = request.headers.get("if-modified-since");
  if (
    ifModifiedSince &&
    new Date(ifModifiedSince).getTime() >= lastModified.getTime()
  ) {
    return new Response(null, { status: 304 });
  }

  try {
    const buffer = await buildApplePass(card.data, certificates);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Last-Modified": lastModified.toUTCString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Apple pass update failed:", error);
    return new Response("Pass generation failed", { status: 500 });
  }
}
