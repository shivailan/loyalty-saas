import { plans, type PlanId } from "@/lib/plans";

// Les trois offres commerciales de KeepMe : Commande (prise de commande à
// emporter), Fidélité (carte de fidélité digitale) et Complet (les deux, moins
// cher). Les fonctionnalités de la fidélité viennent de plans.ts, pour qu'une
// fonctionnalité ne puisse jamais différer entre les écrans. Prix en centimes.
export type Tier = PlanId;

// Ce que le restaurateur a choisi à l'inscription.
export type Offer = "commande" | "fidelite" | "complet";

export const OFFER_LABEL: Record<Offer, string> = {
  commande: "KeepMe Order",
  fidelite: "KeepMe Card",
  complet: "KeepMe Complet",
};

export function parseOffer(value: string | string[] | undefined): Offer {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "commande" || raw === "complet" ? raw : "fidelite";
}

// Niveau choisi sur l'accueil (« niveau=business » dans le lien d'inscription).
export function parseTier(value: string | string[] | undefined | null): Tier | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "essentiel" || raw === "business" ? raw : null;
}

// L'offre inclut-elle la prise de commande ?
export function includesCommande(offer: Offer): boolean {
  return offer === "commande" || offer === "complet";
}

// L'offre inclut-elle la carte de fidélité ?
export function includesLoyalty(offer: Offer): boolean {
  return offer === "fidelite" || offer === "complet";
}

export const TIER_LABEL: Record<Tier, string> = {
  essentiel: "Essentiel",
  business: "Business",
};

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
    "Tout KeepMe Order",
    `Tout KeepMe Card ${TIER_LABEL[tier]}`,
    "Un seul abonnement, un seul tableau de bord",
    "Les passages s'ajoutent en scannant la carte du client, au comptoir",
  ];
}

// ---------------------------------------------------------------------------
// Formules vendables : ce que le commerçant peut acheter selon son offre.
// « fidelite:essentiel » = offre Fidélité au niveau Essentiel, etc.
// ---------------------------------------------------------------------------
export type Choice =
  | "fidelite:essentiel"
  | "fidelite:business"
  | "commande"
  | "complet:essentiel"
  | "complet:business";

export function choiceOf(offer: Offer, tier: Tier | null): Choice | null {
  if (offer === "commande") return "commande";
  if (tier === null) return null;
  return `${offer}:${tier}` as Choice;
}

export function choiceParts(choice: Choice): { offer: Offer; tier: Tier | null } {
  if (choice === "commande") return { offer: "commande", tier: null };
  const [offer, tier] = choice.split(":") as [Offer, Tier];
  return { offer, tier };
}

export function choicesForOffer(offer: Offer): Choice[] {
  if (offer === "commande") return ["commande"];
  return [`${offer}:essentiel`, `${offer}:business`] as Choice[];
}

export function choiceCents(choice: Choice): number {
  const { offer, tier } = choiceParts(choice);
  if (offer === "commande") return PRICE_CENTS.commande;
  if (offer === "complet") return PRICE_CENTS.complet[tier!];
  return fidelityCents(tier!);
}

export function choiceInfo(choice: Choice): {
  name: string;
  description: string;
  price: string;
  features: string[];
  highlighted: boolean;
} {
  const { offer, tier } = choiceParts(choice);
  const price = formatPrice(choiceCents(choice));
  if (offer === "commande") {
    return {
      name: "KeepMe Order",
      description: "Vos commandes à emporter, sans commission et sans file d'attente.",
      price,
      features: COMMANDE_FEATURES,
      highlighted: true,
    };
  }
  if (offer === "complet") {
    return {
      name: `KeepMe Complet ${TIER_LABEL[tier!]}`,
      description: "Commandes et fidélité dans un seul abonnement.",
      price,
      features: completFeatures(tier!),
      highlighted: tier === "business",
    };
  }
  const plan = plans.find((p) => p.id === tier);
  return {
    name: `KeepMe Card ${TIER_LABEL[tier!]}`,
    description: plan?.description ?? "",
    price,
    features: fidelityFeatures(tier!),
    highlighted: tier === "business",
  };
}

// Prix de la formule Business de la même offre (bouton « Passer à Business »).
export function businessUpgradePrice(offer: Offer): string {
  const choice = offer === "complet" ? "complet:business" : "fidelite:business";
  return formatPrice(choiceCents(choice));
}
