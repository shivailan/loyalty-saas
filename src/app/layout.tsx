import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeepMe — Cartes de fidélité digitales",
  description:
    "Remplacez vos cartes de fidélité papier par une carte digitale : QR code, scan en boutique, statistiques en temps réel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
