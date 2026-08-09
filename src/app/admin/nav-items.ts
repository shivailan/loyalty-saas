import type { NavGroup } from "@/lib/nav-types";

export const navGroups: NavGroup[] = [
  {
    label: "Général",
    items: [
      {
        href: "/admin",
        label: "Vue d'ensemble",
        description: "Statistiques globales de la plateforme.",
        icon: "LayoutDashboard",
      },
      {
        href: "/admin/merchants",
        label: "Commerçants",
        description: "Gérer les comptes commerçants inscrits.",
        icon: "Store",
      },
    ],
  },
];
