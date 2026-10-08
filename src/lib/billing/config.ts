import "server-only";
import type { PlanId } from "@/lib/plans";

// Tant que Stripe n'est pas configuré (clé absente), AUCUN accès n'est
// bloqué : on ne verrouille jamais des commerçants sans leur offrir un moyen
// de payer.
export function isBillingEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Durée de l'essai gratuit offert à l'abonnement (0 = pas d'essai).
export function trialDays(): number {
  const value = Number(process.env.STRIPE_TRIAL_DAYS ?? 14);
  return Number.isInteger(value) && value >= 0 ? value : 14;
}

// Identifiant Stripe du prix mensuel de chaque formule (variables d'environnement).
export function priceIdForPlan(plan: PlanId): string | null {
  const value =
    plan === "essentiel"
      ? process.env.STRIPE_PRICE_ESSENTIEL
      : process.env.STRIPE_PRICE_BUSINESS;
  return value || null;
}

export function planForPriceId(priceId: string | undefined): PlanId | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_ESSENTIEL) return "essentiel";
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return "business";
  return null;
}
