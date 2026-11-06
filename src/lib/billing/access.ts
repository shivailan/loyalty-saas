import "server-only";
import { isBillingEnabled } from "./config";
import { BUSINESS_FEATURES, type FeatureKey } from "@/lib/features";
import { includesLoyalty, parseOffer } from "@/lib/offers";

// past_due = un prélèvement a échoué mais Stripe réessaie pendant plusieurs
// jours : on laisse l'accès (avec un avertissement) plutôt que de bloquer un
// commerçant pour une carte expirée.
const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

export type BillingFields = {
  billing_exempt: boolean;
  subscription_status: string;
  is_suspended: boolean;
  offer: string | null;
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

// La carte de fidélité fait-elle partie de la formule ? Fidélité et Complet,
// oui ; Commande seule, non. Les comptes offerts, et l'absence de paiement
// configuré, ouvrent tout.
export function hasLoyalty(merchant: {
  billing_exempt: boolean;
  offer: string | null;
}): boolean {
  if (!isBillingEnabled()) return true;
  return merchant.billing_exempt || includesLoyalty(parseOffer(merchant.offer ?? undefined));
}

// Un commerce « ouvert » à la fidélité : non suspendu, abonnement en règle et
// carte de fidélité dans sa formule. Utilisé pour décider si ses clients
// peuvent s'inscrire et cumuler des passages.
export function isMerchantOpen(merchant: BillingFields): boolean {
  return !merchant.is_suspended && hasPaidAccess(merchant) && hasLoyalty(merchant);
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
