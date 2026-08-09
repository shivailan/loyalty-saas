export type IconName =
  | "LayoutDashboard"
  | "ScanLine"
  | "Users"
  | "Settings2"
  | "Palette"
  | "QrCode"
  | "BarChart3"
  | "Mail"
  | "UserCog"
  | "Store";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconName;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
