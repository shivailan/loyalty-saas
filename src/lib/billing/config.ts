import "server-only";
import { choiceParts, type Choice, type Offer, type Tier } from "@/lib/offers";

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
function priceEnv(choice: Choice): string | undefined {
  switch (choice) {
    case "fidelite:essentiel":
      return process.env.STRIPE_PRICE_ESSENTIEL;
    case "fidelite:business":
      return process.env.STRIPE_PRICE_BUSINESS;
    case "commande":
      return process.env.STRIPE_PRICE_COMMANDE;
    case "complet:essentiel":
      return process.env.STRIPE_PRICE_COMPLET_ESSENTIEL;
    case "complet:business":
      return process.env.STRIPE_PRICE_COMPLET_BUSINESS;
  }
}

export function priceIdForChoice(choice: Choice): string | null {
  return priceEnv(choice) || null;
}

const ALL_CHOICES: Choice[] = [
  "fidelite:essentiel",
  "fidelite:business",
  "commande",
  "complet:essentiel",
  "complet:business",
];

// Retrouve l'offre et le niveau d'après le prix Stripe d'un abonnement.
export function billingForPriceId(
  priceId: string | undefined,
): { choice: Choice; offer: Offer; tier: Tier | null } | null {
  if (!priceId) return null;
  const choice = ALL_CHOICES.find((c) => priceEnv(c) === priceId);
  return choice ? { choice, ...choiceParts(choice) } : null;
}
