import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planForPriceId } from "./config";

// Recopie l'état d'un abonnement Stripe dans la base. Appelé par le webhook
// et au retour du paiement : idempotent, on peut donc l'appeler plusieurs
// fois sans risque, dans n'importe quel ordre.
export async function syncSubscription(
  subscription: Stripe.Subscription,
): Promise<void> {
  const supabase = createAdminClient();
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const item = subscription.items.data[0];

  const update = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_plan: planForPriceId(item?.price.id),
    subscription_period_end: item
      ? new Date(item.current_period_end * 1000).toISOString()
      : null,
  };

  // On retrouve le commerçant par son client Stripe, et à défaut par
  // l'identifiant placé dans les métadonnées à la création de l'abonnement.
  const byCustomer = await supabase
    .from("merchants")
    .update(update)
    .eq("stripe_customer_id", customerId)
    .select("id");
  if (byCustomer.error) throw new Error(byCustomer.error.message);
  if (byCustomer.data.length > 0) return;

  const merchantId = subscription.metadata?.merchant_id;
  if (!merchantId) {
    console.error("Stripe subscription without known merchant:", subscription.id);
    return;
  }
  const byMetadata = await supabase
    .from("merchants")
    .update(update)
    .eq("id", merchantId);
  if (byMetadata.error) throw new Error(byMetadata.error.message);
}
