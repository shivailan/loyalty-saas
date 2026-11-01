import { after } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashIntegrationKey } from "@/lib/integrations/key";
import { findOrCreateCard } from "@/lib/loyalty/enroll";
import { isMerchantOpen } from "@/lib/billing/access";
import { allowAction } from "@/lib/rate-limit";
import { notifyWalletUpdate } from "@/lib/wallet/notify";
import { sendRewardEmail, sendWelcomeEmail } from "@/lib/email/send";

export const runtime = "nodejs";

// Une application de commande (Qtime) appelle cette adresse quand une commande
// est retirée : le client reçoit un passage sur sa carte de fidélité. La clé de
// liaison du commerçant (Authorization: Bearer kmk_…) identifie le commerce.
const bodySchema = z.object({
  source: z.string().min(1).max(30),
  orderId: z.string().min(1).max(100),
  email: z.string().email().max(200),
  firstName: z.string().trim().min(1).max(60),
  phone: z.string().max(30).optional().nullable(),
  marketingConsent: z.boolean().optional(),
});

const MAX_CALLS_PER_MERCHANT_PER_HOUR = 2000;

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const key = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!key) return json({ error: "unauthorized" }, 401);

  const supabase = createAdminClient();
  const { data: merchant } = await supabase
    .from("merchants")
    .select(
      "id, name, send_welcome_email, send_reward_email, is_suspended, billing_exempt, subscription_status",
    )
    .eq("integration_key_hash", hashIntegrationKey(key))
    .maybeSingle();
  if (!merchant) return json({ error: "unauthorized" }, 401);

  if (!isMerchantOpen(merchant)) return json({ error: "inactive" }, 403);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: "invalid_body" }, 400);
  const input = parsed.data;

  const allowed = await allowAction(
    `orderlink:${merchant.id}`,
    MAX_CALLS_PER_MERCHANT_PER_HOUR,
    3600,
  );
  if (!allowed) return json({ error: "rate_limited" }, 429);

  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("id, visits_required, reward_description")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!program) return json({ error: "no_program" }, 409);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // On réserve la commande avant tout : un second appel pour la même commande
  // (nouvel essai de Qtime) tombe sur la contrainte d'unicité et n'ajoute rien.
  const { error: claimError } = await supabase
    .from("external_order_visits")
    .insert({
      merchant_id: merchant.id,
      source: input.source,
      external_order_id: input.orderId,
    });
  if (claimError) {
    if (claimError.code === "23505") {
      const { data: previous } = await supabase
        .from("external_order_visits")
        .select("card_id")
        .eq("merchant_id", merchant.id)
        .eq("source", input.source)
        .eq("external_order_id", input.orderId)
        .maybeSingle();
      return json(
        {
          status: "duplicate",
          cardUrl: previous?.card_id ? `${siteUrl}/card/${previous.card_id}` : null,
        },
        200,
      );
    }
    console.error("Order link: claim failed", claimError.message);
    return json({ error: "server_error" }, 500);
  }

  const release = () =>
    supabase
      .from("external_order_visits")
      .delete()
      .eq("merchant_id", merchant.id)
      .eq("source", input.source)
      .eq("external_order_id", input.orderId);

  const enrolled = await findOrCreateCard(supabase, {
    merchantId: merchant.id,
    programId: program.id,
    firstName: input.firstName,
    lastName: "",
    email: input.email,
    phone: input.phone,
    marketingConsent: input.marketingConsent ?? false,
  });
  if (enrolled.error !== null) {
    await release();
    console.error("Order link: enroll failed", enrolled.error);
    return json({ error: "server_error" }, 500);
  }
  const { cardId, isNewCustomer } = enrolled;

  // La commande retirée est la preuve du passage : pas de délai anti double
  // scan (0 seconde), l'unicité de la commande suffit.
  const { data: visits, error: visitError } = await supabase.rpc("add_visit", {
    p_card_id: cardId,
    p_cooldown_seconds: 0,
  });
  const visit = visits?.[0];
  if (visitError || !visit || visit.status !== "ok") {
    await release();
    if (visit?.status === "inactive") return json({ error: "no_program" }, 409);
    console.error("Order link: add_visit failed", visitError?.message ?? visit?.status);
    return json({ error: "server_error" }, 500);
  }

  await supabase
    .from("external_order_visits")
    .update({ card_id: cardId })
    .eq("merchant_id", merchant.id)
    .eq("source", input.source)
    .eq("external_order_id", input.orderId);

  after(() => notifyWalletUpdate(cardId, { googleNotify: true }));

  const cardUrl = `${siteUrl}/card/${cardId}`;
  if (isNewCustomer && merchant.send_welcome_email) {
    await sendWelcomeEmail({
      to: input.email,
      customerFirstName: input.firstName,
      merchantName: merchant.name,
      cardUrl,
    });
  }

  const rewardReached = visit.new_stamps >= program.visits_required;
  if (
    merchant.send_reward_email &&
    rewardReached &&
    visit.previous_stamps < program.visits_required
  ) {
    await sendRewardEmail({
      to: input.email,
      customerFirstName: input.firstName,
      merchantName: merchant.name,
      rewardDescription: program.reward_description,
      cardUrl,
    });
  }

  return json(
    {
      status: "ok",
      cardUrl,
      stamps: visit.new_stamps,
      visitsRequired: program.visits_required,
      rewardReached,
    },
    200,
  );
}
