import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { Faq, type FaqItem } from "@/components/landing/Faq";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";
import { PRICE_CENTS, fidelityCents, formatPrice } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Tarifs KeepMe : commande à emporter, carte de fidélité ou les deux",
  description: `Tous les tarifs KeepMe : Order à ${formatPrice(PRICE_CENTS.commande)} €/mois, Card dès ${formatPrice(fidelityCents("essentiel"))} €/mois, ou les deux ensemble avec Complet. Sans commission, sans engagement.`,
  alternates: { canonical: "/tarifs" },
};

const faq: FaqItem[] = [
  {
    question: "Y a-t-il une commission sur les commandes ?",
    answer:
      "Non. Les abonnements sont à prix fixe par mois. Il n'y a aucune commission sur vos commandes.",
  },
  {
    question: "Quelle différence entre Essentiel et Business ?",
    answer:
      "Le niveau s'applique à KeepMe Card et à KeepMe Complet. Business ajoute l'export de vos clients au format Excel, des offres envoyées en notification sur le téléphone de vos clients (une par jour), le support par WhatsApp et un accompagnement à la mise en place.",
  },
  {
    question: "Puis-je changer de formule plus tard ?",
    answer:
      "Oui. Vous pouvez passer d'Essentiel à Business depuis votre espace. Pour ajouter l'autre produit et passer à KeepMe Complet, écrivez-nous à contact@keepmecard.fr.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer:
      "Non. Les abonnements sont sans engagement et résiliables à tout moment.",
  },
  {
    question: "Les prix incluent-ils la TVA ?",
    answer:
      "Les prix sont en euros par mois, TVA non applicable (article 293 B du Code général des impôts).",
  },
];

export default function TarifsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1">
        <Pricing asPage />
        <Faq items={faq} />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
