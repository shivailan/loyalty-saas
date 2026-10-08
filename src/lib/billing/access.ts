import "server-only";
import { isBillingEnabled } from "./config";

// past_due = un prélèvement a échoué mais Stripe réessaie pendant plusieurs
// jours : on laisse l'accès (avec un avertissement) plutôt que de bloquer un
// commerçant pour une carte expirée.
const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

export type BillingFields = {
  billing_exempt: boolean;
  subscription_status: string;
  is_suspended: boolean;
};

export function hasPaidAccess(
  merchant: Pick<BillingFields, "billing_exempt" | "subscription_status">,
): boolean {
  if (!isBillingEnabled()) return true;
  return (
    merchant.billing_exempt ||
    ACTIVE_STATUSES.includes(merchant.subscription_status)
  );
}

// Un commerce « ouvert » : non suspendu et abonnement en règle. Utilisé pour
// décider si ses clients peuvent encore s'inscrire.
export function isMerchantOpen(merchant: BillingFields): boolean {
  return !merchant.is_suspended && hasPaidAccess(merchant);
}
