import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialEndingEmail } from "@/lib/email/send";
import { choiceInfo } from "@/lib/offers";
import { billingForPriceId } from "./config";

// Prévient le commerçant, quelques jours avant, que son essai gratuit se
// termine et que le premier paiement va être prélevé.
export async function sendTrialEnding(
  subscription: Stripe.Subscription,
): Promise<void> {
  if (!subscription.trial_end) return;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const supabase = createAdminClient();
  const { data: merchant } = await supabase
    .from("merchants")
    .select("name, owner_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (!merchant) return;

  const { data: owner } = await supabase.auth.admin.getUserById(
    merchant.owner_id,
  );
  const email = owner.user?.email;
  if (!email) return;

  const billing = billingForPriceId(subscription.items.data[0]?.price.id);
  const plan = billing ? choiceInfo(billing.choice) : null;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.keepmecard.fr";

  await sendTrialEndingEmail({
    to: email,
    merchantName: merchant.name.trim(),
    planName: plan?.name ?? "KeepMe",
    price: plan?.price ?? "",
    trialEndDate: new Date(subscription.trial_end * 1000).toLocaleDateString(
      "fr-FR",
      {
        timeZone: "Europe/Paris",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ),
    billingUrl: `${base}/dashboard/billing`,
  });
}
