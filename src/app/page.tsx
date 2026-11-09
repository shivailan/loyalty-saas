import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { CardShowcase } from "@/components/landing/CardShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CommandeSection } from "@/components/landing/CommandeSection";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";
import { PRICE_CENTS, fidelityCents } from "@/lib/offers";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Données structurées : les deux produits et leur prix de départ (par mois).
function euros(cents: number): string {
  return (cents / 100).toFixed(2);
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "KeepMe", url: SITE_URL },
    {
      "@type": "SoftwareApplication",
      name: "KeepMe Order",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Commande à emporter pour restaurants : page de commande, écran cuisine, zéro commission.",
      offers: {
        "@type": "Offer",
        price: euros(PRICE_CENTS.commande),
        priceCurrency: "EUR",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "KeepMe Card",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Carte de fidélité digitale dans Apple Wallet et Google Wallet pour les commerçants.",
      offers: {
        "@type": "Offer",
        price: euros(fidelityCents("essentiel")),
        priceCurrency: "EUR",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgressBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <CommandeSection moreHref="/commande-a-emporter" />
        <CardShowcase moreHref="/carte-de-fidelite" />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
