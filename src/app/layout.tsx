import type { Metadata } from "next";
import "./globals.css";
import { NavigationProgress } from "@/components/ui/NavigationProgress";

export const metadata: Metadata = {
  title: "KeepMe — Commande à emporter et cartes de fidélité pour restaurateurs",
  description:
    "Prenez vos commandes à emporter en ligne, sans commission, et fidélisez vos clients avec une carte digitale dans Apple Wallet et Google Wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}
