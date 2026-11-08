import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouveau mot de passe — KeepMe",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
