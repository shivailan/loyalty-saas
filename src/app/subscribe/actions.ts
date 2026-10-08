"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/billing/stripe";
import { isBillingEnabled, priceIdForPlan, trialDays } from "@/lib/billing/config";
import type { PlanId } from "@/lib/plans";

async function siteUrl(): Promise<string> {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (await headers()).get("origin") ||
    "http://localhost:3000"
  );
}

async function currentMerchant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, name, stripe_customer_id")
    .eq("owner_id", user.id)
    .single();
  if (!merchant) redirect("/login");
  return { user, merchant };
}

// Crée (une seule fois) le client Stripe du commerçant et le mémorise.
async function ensureStripeCustomer(
  merchant: { id: string; name: string; stripe_customer_id: string | null },
  email: string | undefined,
): Promise<string> {
  if (merchant.stripe_customer_id) return merchant.stripe_customer_id;

  const customer = await getStripe().customers.create({
    email,
    name: merchant.name.trim(),
    metadata: { merchant_id: merchant.id },
  });
  const { error } = await createAdminClient()
    .from("merchants")
    .update({ stripe_customer_id: customer.id })
    .eq("id", merchant.id)
    .is("stripe_customer_id", null);
  if (error) throw new Error(error.message);
  return customer.id;
}

// Ouvre la page de paiement Stripe pour la formule choisie.
export async function startCheckout(plan: PlanId): Promise<void> {
  if (!isBillingEnabled()) redirect("/dashboard");
  const priceId = priceIdForPlan(plan);
  if (!priceId) redirect("/subscribe?error=1");

  const { user, merchant } = await currentMerchant();
  const base = await siteUrl();

  let url: string | null = null;
  try {
    const customerId = await ensureStripeCustomer(merchant, user.email);
    const days = trialDays();
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: merchant.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { merchant_id: merchant.id, plan },
        ...(days > 0 ? { trial_period_days: days } : {}),
      },
      success_url: `${base}/subscribe/done?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/subscribe`,
      locale: "fr",
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      customer_update: { name: "auto", address: "auto" },
      allow_promotion_codes: true,
    });
    url = session.url;
  } catch (error) {
    console.error("Stripe checkout creation failed:", error);
  }
  redirect(url ?? "/subscribe?error=1");
}

// Ouvre le portail Stripe : changer de carte, voir les factures, résilier.
export async function openBillingPortal(): Promise<void> {
  if (!isBillingEnabled()) redirect("/dashboard");
  const { merchant } = await currentMerchant();
  if (!merchant.stripe_customer_id) redirect("/subscribe");

  let url: string | null = null;
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: merchant.stripe_customer_id,
      return_url: `${await siteUrl()}/dashboard/billing`,
    });
    url = session.url;
  } catch (error) {
    console.error("Stripe portal creation failed:", error);
  }
  redirect(url ?? "/dashboard/billing?error=1");
}
