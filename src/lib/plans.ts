// Source unique des offres : utilisée par la page Tarifs et par les CGV, pour
// qu'un prix ou une fonctionnalité ne puisse jamais différer entre les deux.
export type Feature = { label: string; soon?: boolean };

export type Plan = {
  name: string;
  price: string;
  description: string;
  features: Feature[];
  highlighted?: boolean;
  comingSoon?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Essentiel",
    price: "39,99",
    description: "Tout pour lancer votre carte de fidélité digitale.",
    features: [
      { label: "QR code et carte de fidélité illimités" },
      { label: "Clients et passages illimités" },
      { label: "Statistiques en temps réel" },
      { label: "Logo et couleurs de votre commerce" },
      { label: "Emails automatiques à vos clients" },
      { label: "Support par email" },
      { label: "Notifications push", soon: true },
    ],
  },
  {
    name: "Business",
    price: "49,99",
    description: "Un accompagnement plus proche, dès le premier jour.",
    highlighted: true,
    features: [
      { label: "Tout ce qui est inclus dans Essentiel" },
      { label: "Support par WhatsApp" },
      { label: "Accompagnement à la mise en place inclus" },
      { label: "Notifications push", soon: true },
    ],
  },
  {
    name: "Prochainement",
    price: "69,99",
    description: "Une offre plus complète arrive bientôt.",
    comingSoon: true,
    features: [],
  },
];
