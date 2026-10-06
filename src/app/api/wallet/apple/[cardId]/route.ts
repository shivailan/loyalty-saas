import { createAdminClient } from "@/lib/supabase/admin";
import { allowAction, fingerprint } from "@/lib/rate-limit";
import { getWalletCertificates } from "@/lib/wallet/config";
import { buildApplePass } from "@/lib/wallet/apple-pass";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  const allowed = await allowAction(
    `wallet:${fingerprint(ip)}`,
    30,
    60 * 60,
  );
  if (!allowed) {
    return new Response("Too many requests", { status: 429 });
  }

  const supabase = createAdminClient();
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select(
      `
      id,
      current_stamps,
      customers ( first_name ),
      loyalty_programs ( visits_required, reward_description, merchants ( name, primary_color, logo_url ) )
    `,
    )
    .eq("id", cardId)
    .maybeSingle();

  const program = card?.loyalty_programs;
  const merchant = program?.merchants;
  if (!card || !program || !merchant) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const buffer = await buildApplePass(
      {
        cardId: card.id,
        stamps: card.current_stamps,
        required: program.visits_required,
        rewardDescription: program.reward_description,
        firstName: card.customers?.first_name ?? null,
        merchantName: merchant.name,
        merchantColor: merchant.primary_color,
        merchantLogoUrl: merchant.logo_url,
        siteUrl:
          process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin,
      },
      certificates,
    );
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="keepme-${card.id.slice(0, 8)}.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Apple pass generation failed:", error);
    return new Response("Pass generation failed", { status: 500 });
  }
}
