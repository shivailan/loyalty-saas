import { createAdminClient } from "@/lib/supabase/admin";
import { buildSquareLogo } from "@/lib/wallet/images";
import { UUID_PATTERN } from "@/lib/wallet/load-card";

export const runtime = "nodejs";

// Logo du commerçant en PNG carré, lu par Google pour sa carte. Public par
// nature : le logo est déjà affiché sur la page de la carte.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ merchantId: string }> },
) {
  const { merchantId } = await params;
  if (!UUID_PATTERN.test(merchantId)) {
    return new Response("Not found", { status: 404 });
  }
  const { data: merchant } = await createAdminClient()
    .from("merchants")
    .select("logo_url")
    .eq("id", merchantId)
    .maybeSingle();
  if (!merchant) {
    return new Response("Not found", { status: 404 });
  }

  const png = await buildSquareLogo(merchant.logo_url);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
