// Source unique des offres : utilisée par la page Tarifs et par les CGV, pour
// qu'un prix ou une fonctionnalité ne puisse jamais différer entre les deux.
// excluded : fonctionnalité absente de cette formule, affichée barrée pour
// montrer ce que la formule supérieure apporte.
export type Feature = { label: string; excluded?: boolean };

export type PlanId = "essentiel" | "business";

export type Plan = {
  id?: PlanId;
  name: string;
  price: string;
  description: string;
  features: Feature[];
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: "19,99",
    description: "Tout pour lancer votre carte de fidélité digitale.",
    features: [
      { label: "QR code et carte de fidélité illimités" },
      { label: "Clients et passages illimités" },
      { label: "Carte ajoutable à Apple Wallet et Google Wallet" },
      { label: "Statistiques en temps réel" },
      { label: "Logo et 2 couleurs de votre commerce" },
      { label: "Emails automatiques à vos clients" },
      { label: "Support par email" },
      { label: "Export de vos clients au format Excel", excluded: true },
      {
        label:
          "Offres envoyées en notification sur le téléphone de vos clients",
        excluded: true,
      },
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "29,99",
    description: "Un accompagnement plus proche, dès le premier jour.",
    highlighted: true,
    features: [
      { label: "Tout ce qui est inclus dans Essentiel" },
      { label: "Export de vos clients au format Excel" },
      {
        label:
          "Offres envoyées en notification sur le téléphone de vos clients (1 par jour)",
      },
      { label: "Support par WhatsApp" },
      { label: "Accompagnement à la mise en place inclus" },
    ],
  },
];

// Prix affiché de la formule Business : source unique pour les boutons de
// montée en gamme (jamais de prix écrit en dur ailleurs).
export const businessPrice = plans.find(
  (plan) => plan.id === "business",
)!.price;
