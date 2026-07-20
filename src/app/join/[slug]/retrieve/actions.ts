"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  retrieveCardSchema,
  type RetrieveCardInput,
} from "@/lib/validations/retrieve-card";
import { sendRetrieveCardEmail } from "@/lib/email/send";

export async function retrieveCard(
  slug: string,
  input: RetrieveCardInput,
): Promise<{ error: string | null }> {
  const parsed = retrieveCardSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
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
