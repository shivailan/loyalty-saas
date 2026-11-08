"use server";

import { createClient } from "@/lib/supabase/server";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { parseOffer, parseTier, type Offer, type Tier } from "@/lib/offers";

export async function signup(
  input: SignupInput,
  offer: Offer = "fidelite",
  tier: Tier | null = null,
): Promise<{ error: string | null }> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        business_name: parsed.data.businessName,
        offer: parseOffer(offer),
        // Niveau choisi sur l'accueil : la page de paiement ne propose que lui.
        ...(parseOffer(offer) !== "commande" && parseTier(tier) ? { tier: parseTier(tier) } : {}),
        terms_accepted_at: new Date().toISOString(),
      },
      emailRedirectTo: `${siteUrl}/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
