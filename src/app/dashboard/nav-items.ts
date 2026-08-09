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
        label: "Scanner",
        description: "Ajoutez un passage à la carte d'un client.",
        icon: "ScanLine",
      },
      {
        href: "/dashboard/clients",
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
        label: "Programme",
        description: "Nombre de passages requis et récompense offerte.",
        icon: "Settings2",
      },
      {
        href: "/dashboard/branding",
        label: "Apparence",
        description: "Logo et couleur de la carte de fidélité.",
        icon: "Palette",
      },
      {
        href: "/dashboard/qr-code",
        label: "QR code",
        description: "Le code que vos clients scannent pour s'inscrire.",
        icon: "QrCode",
      },
      {
        href: "/dashboard/notifications",
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
    ],
  },
];
