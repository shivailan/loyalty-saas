import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { WalletCardData } from "./apple-pass";

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Adresse publique du site. Une variable vide ou absente retombe sur
// l'origine de la requête en cours (utile en local).
export function resolveSiteUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function loadWalletCard(
  cardId: string,
  siteUrl: string,
): Promise<{ data: WalletCardData; updatedAt: string } | null> {
  const supabase = createAdminClient();
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select(
      `
      id,
      current_stamps,
      updated_at,
      customers ( first_name ),
      loyalty_programs ( visits_required, reward_description, merchants ( name, primary_color, logo_url ) )
    `,
    )
    .eq("id", cardId)
    .maybeSingle();

  const program = card?.loyalty_programs;
  const merchant = program?.merchants;
  if (!card || !program || !merchant) return null;

  return {
    updatedAt: card.updated_at,
    data: {
      cardId: card.id,
      stamps: card.current_stamps,
      required: program.visits_required,
      rewardDescription: program.reward_description,
      firstName: card.customers?.first_name ?? null,
      merchantName: merchant.name,
      merchantColor: merchant.primary_color,
      merchantLogoUrl: merchant.logo_url,
      siteUrl,
    },
  };
}
