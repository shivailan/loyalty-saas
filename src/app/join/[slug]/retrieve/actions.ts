"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  retrieveCardSchema,
  type RetrieveCardInput,
} from "@/lib/validations/retrieve-card";
import { sendRetrieveCardEmail } from "@/lib/email/send";
import { allowAction, fingerprint, getClientFingerprint } from "@/lib/rate-limit";

// Empêche d'inonder la boîte mail de quelqu'un en répétant la demande.
const MAX_REQUESTS_PER_EMAIL_PER_HOUR = 3;
const MAX_REQUESTS_PER_IP_PER_HOUR = 10;

export async function retrieveCard(
  slug: string,
  input: RetrieveCardInput,
): Promise<{ error: string | null }> {
  const parsed = retrieveCardSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  // Dans tous les cas ci-dessous (robot, limite atteinte), on renvoie la même
  // réponse neutre : on ne révèle jamais si un email est inscrit ou non.
  if (parsed.data.website) {
    return { error: null };
  }

  const emailAllowed = await allowAction(
    `retrieve:email:${fingerprint(`${slug}:${parsed.data.email}`)}`,
    MAX_REQUESTS_PER_EMAIL_PER_HOUR,
    3600,
  );
  const ipAllowed = await allowAction(
    `retrieve:ip:${await getClientFingerprint()}`,
    MAX_REQUESTS_PER_IP_PER_HOUR,
    3600,
  );
  if (!emailAllowed || !ipAllowed) {
    return { error: null };
  }

  const supabase = createAdminClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, name")
    .eq("slug", slug)
    .maybeSingle();

  if (merchant) {
    const { data: customer } = await supabase
      .from("customers")
      .select("id, first_name")
      .eq("merchant_id", merchant.id)
      .eq("email", parsed.data.email)
      .maybeSingle();

    if (customer) {
      const { data: cards } = await supabase
        .from("loyalty_cards")
        .select("id")
        .eq("customer_id", customer.id);

      if (cards && cards.length > 0) {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        await sendRetrieveCardEmail({
          to: parsed.data.email,
          customerFirstName: customer.first_name,
          merchantName: merchant.name,
          cardUrls: cards.map((card) => `${siteUrl}/card/${card.id}`),
        });
      }
    }
  }

  // Toujours la même réponse, que l'email existe ou non (anti-énumération).
  return { error: null };
}
