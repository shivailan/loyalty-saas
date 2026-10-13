import { createClient } from "@/lib/supabase/server";
import { hasPaidAccess } from "@/lib/billing/access";
import { buildPoster } from "@/lib/poster/build-poster";

export const runtime = "nodejs";

// Génère l'affiche A4 du commerçant connecté (?inline=1 pour l'aperçu).
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select(
      "id, name, slug, logo_url, primary_color, secondary_color, billing_exempt, subscription_status",
    )
    .eq("owner_id", user.id)
    .single();
  if (!merchant || !hasPaidAccess(merchant)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("visits_required, reward_description")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .maybeSingle();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const pdf = await buildPoster({
      merchantName: merchant.name,
      joinUrl: `${siteUrl}/join/${merchant.slug}`,
      logoUrl: merchant.logo_url,
      primaryColor: merchant.primary_color,
      secondaryColor: merchant.secondary_color,
      visitsRequired: program?.visits_required ?? null,
      rewardDescription: program?.reward_description ?? null,
    });
    const inline = new URL(request.url).searchParams.get("inline") === "1";
    // Mémorise le premier téléchargement (et non l'aperçu) pour cocher
    // l'étape correspondante du guide de démarrage.
    if (!inline) {
      await supabase
        .from("merchants")
        .update({ poster_downloaded_at: new Date().toISOString() })
        .eq("id", merchant.id)
        .is("poster_downloaded_at", null);
    }
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="affiche-fidelite-${merchant.slug}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Poster generation failed:", error);
    return new Response("Poster generation failed", { status: 500 });
  }
}
