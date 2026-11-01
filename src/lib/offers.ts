import { plans, type PlanId } from "@/lib/plans";

// Les trois offres commerciales de KeepMe : Commande (prise de commande à
// emporter), Fidélité (carte de fidélité digitale) et Complet (les deux, moins
// cher). Les fonctionnalités de la fidélité viennent de plans.ts, pour qu'une
// fonctionnalité ne puisse jamais différer entre les écrans. Prix en centimes.
export type Tier = PlanId;

// Ce que le restaurateur a choisi à l'inscription.
export type Offer = "commande" | "fidelite" | "complet";

export const OFFER_LABEL: Record<Offer, string> = {
  commande: "KeepMe Commande",
  fidelite: "KeepMe Fidélité",
  complet: "KeepMe Complet",
};

export function parseOffer(value: string | string[] | undefined): Offer {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "commande" || raw === "complet" ? raw : "fidelite";
}

// L'offre inclut-elle la prise de commande ?
export function includesCommande(offer: Offer): boolean {
  return offer === "commande" || offer === "complet";
}

export const TIER_LABEL: Record<Tier, string> = {
  essentiel: "Essentiel",
  business: "Business",
};

// L'application de commande vit sur un sous-domaine du même site.
export const COMMANDE_URL =
  process.env.NEXT_PUBLIC_COMMANDE_URL ?? "https://commande.keepmecard.fr";

export const PRICE_CENTS = {
  commande: 6999,
  complet: { essentiel: 7999, business: 8999 },
} as const;

function planCents(tier: Tier): number {
  const plan = plans.find((p) => p.id === tier);
  return Math.round(Number((plan?.price ?? "0").replace(",", ".")) * 100);
}

export function fidelityCents(tier: Tier): number {
  return planCents(tier);
}

// Les deux produits achetés séparément.
export function separateCents(tier: Tier): number {
  return PRICE_CENTS.commande + planCents(tier);
}

export function savingCents(tier: Tier): number {
  return separateCents(tier) - PRICE_CENTS.complet[tier];
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export const COMMANDE_FEATURES = [
  "Votre page de commande à votre nom et vos couleurs",
  "QR code pour le comptoir et la vitrine",
  "Écran cuisine en direct, avec alerte sonore",
  "Carte, prix et ruptures modifiables vous-même",
  "Numéro de ticket et suivi de commande pour le client",
  "Commandes illimitées, zéro commission",
  "Vos clients restent à vous",
];

export function fidelityFeatures(tier: Tier): string[] {
  const plan = plans.find((p) => p.id === tier);
  return (plan?.features ?? [])
    .filter((feature) => !feature.excluded)
    .map((feature) => feature.label);
}

export function completFeatures(tier: Tier): string[] {
  return [
    "Tout KeepMe Commande",
    `Tout KeepMe Fidélité ${TIER_LABEL[tier]}`,
    "Un passage ajouté automatiquement sur la carte du client à chaque commande retirée, sans scan",
    "Le client reçoit sa carte par e-mail dès sa première commande",
  ];
}
