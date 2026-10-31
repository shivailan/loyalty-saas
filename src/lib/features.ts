// Options réservées à la formule Business. Ce fichier ne contient que des
// données : il peut être importé aussi bien côté serveur que côté navigateur.
export type FeatureKey = "walletOffers" | "customerExport";

export const BUSINESS_FEATURES: FeatureKey[] = [
  "walletOffers",
  "customerExport",
];

export const LOCKED_MESSAGE = "Cette option se débloque avec l’offre Business.";
