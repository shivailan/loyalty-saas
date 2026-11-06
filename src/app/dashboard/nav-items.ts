import type { NavGroup } from "@/lib/nav-types";

export const navGroups: NavGroup[] = [
  {
    label: "Général",
    items: [
      {
        href: "/dashboard",
        label: "Vue d'ensemble",
        description: "Le point de départ de votre espace.",
        icon: "LayoutDashboard",
      },
      {
        href: "/dashboard/stats",
        loyalty: true,
        label: "Statistiques",
        description: "Inscriptions, passages, récompenses, clients actifs.",
        icon: "BarChart3",
      },
    ],
  },
  {
    label: "Au quotidien",
    items: [
      {
        href: "/dashboard/scan",
        loyalty: true,
        label: "Scanner",
        description: "Ajoutez un passage à la carte d'un client.",
        icon: "ScanLine",
      },
      {
        href: "/dashboard/offers",
        loyalty: true,
        label: "Offres Wallet",
        description:
          "Envoyez une promotion en notification sur le téléphone de vos clients.",
        icon: "Megaphone",
        feature: "walletOffers",
      },
      {
        href: "/dashboard/clients",
        loyalty: true,
        label: "Clients",
        description: "La liste de vos clients inscrits et leur progression.",
        icon: "Users",
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        href: "/dashboard/program",
        loyalty: true,
        label: "Programme",
        description: "Nombre de passages requis et récompense offerte.",
        icon: "Settings2",
      },
      {
        href: "/dashboard/branding",
        loyalty: true,
        label: "Apparence",
        description: "Logo et couleur de la carte de fidélité.",
        icon: "Palette",
      },
      {
        href: "/dashboard/qr-code",
        loyalty: true,
        label: "QR code",
        description: "Le code que vos clients scannent pour s'inscrire.",
        icon: "QrCode",
      },
      {
        href: "/dashboard/notifications",
        loyalty: true,
        label: "Notifications",
        description: "Choisissez les emails envoyés à vos clients.",
        icon: "Mail",
      },
    ],
  },
  {
    label: "Compte",
    items: [
      {
        href: "/dashboard/settings",
        label: "Paramètres",
        description: "Nom de l'établissement et mot de passe.",
        icon: "UserCog",
      },
      {
        href: "/dashboard/billing",
        label: "Abonnement",
        description: "Votre formule, vos factures et votre moyen de paiement.",
        icon: "CreditCard",
      },
    ],
  },
];

// Le menu d'un commerçant : sans la carte de fidélité dans sa formule
// (KeepMe Commande seul), les pages de fidélité disparaissent.
export function navGroupsFor(hasLoyalty: boolean): NavGroup[] {
  if (hasLoyalty) return navGroups;
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.loyalty),
    }))
    .filter((group) => group.items.length > 0);
}
