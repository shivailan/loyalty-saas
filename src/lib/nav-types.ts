import type { FeatureKey } from "./features";

export type IconName =
  | "LayoutDashboard"
  | "ScanLine"
  | "Users"
  | "Settings2"
  | "Palette"
  | "QrCode"
  | "BarChart3"
  | "Mail"
  | "Megaphone"
  | "CreditCard"
  | "UserCog"
  | "Store";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconName;
  // Option réservée à la formule Business (cadenas si elle n'est pas incluse).
  feature?: FeatureKey;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
