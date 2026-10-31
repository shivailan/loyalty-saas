import "server-only";
import { isBillingEnabled } from "./config";
import { BUSINESS_FEATURES, type FeatureKey } from "@/lib/features";

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

// Les options Business (offres en notification, export Excel) ne sont ouvertes
// qu'à la formule Business. Les comptes offerts, et l'absence de paiement
// configuré, n'y changent rien : tout est alors ouvert.
export function hasFeature(
  _feature: FeatureKey,
  merchant: { billing_exempt: boolean; subscription_plan: string | null },
): boolean {
  if (!isBillingEnabled()) return true;
  return merchant.billing_exempt || merchant.subscription_plan === "business";
}

// Options verrouillées pour ce commerçant (pour afficher les cadenas).
export function lockedFeatures(merchant: {
  billing_exempt: boolean;
  subscription_plan: string | null;
}): FeatureKey[] {
  return BUSINESS_FEATURES.filter((feature) => !hasFeature(feature, merchant));
}
