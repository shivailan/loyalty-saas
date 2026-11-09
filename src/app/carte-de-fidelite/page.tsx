import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ProductHero, CtaBand } from "@/components/landing/ProductHero";
import { CardShowcase } from "@/components/landing/CardShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { OfferCard } from "@/components/landing/Offers";
import { Faq, type FaqItem } from "@/components/landing/Faq";
import { Reveal } from "@/components/landing/Motion";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";
import { choiceInfo } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Carte de fidélité digitale pour restaurant — KeepMe Card",
  description:
    "KeepMe Card : une carte de fidélité dans Apple Wallet et Google Wallet, sans application ni carte papier. Vos clients cumulent des passages et reviennent.",
  alternates: { canonical: "/carte-de-fidelite" },
};

const faq: FaqItem[] = [
  {
    question: "Mes clients doivent-ils télécharger une application ?",
    answer:
      "Non. La carte s'ajoute directement à Apple Wallet ou Google Wallet depuis leur téléphone, sans application à installer.",
  },
  {
    question: "Comment un client s'inscrit-il ?",
    answer:
      "En scannant le QR code affiché en caisse : prénom, nom et e-mail, en quelques secondes. Aucun mot de passe à retenir.",
  },
  {
    question: "Comment j'ajoute un passage à la carte d'un client ?",
    answer:
      "En scannant sa carte avec votre téléphone depuis votre tableau de bord : le passage s'ajoute en une seconde.",
  },
  {
    question: "Que se passe-t-il quand le client atteint le seuil ?",
    answer:
      "La récompense se débloque : vous la lui offrez en un clic, et le compteur repart à zéro.",
  },
  {
    question: "Quelle différence entre Essentiel et Business ?",
    answer:
      "Business ajoute l'export de vos clients au format Excel, des offres envoyées en notification sur le téléphone de vos clients (une par jour), le support par WhatsApp et un accompagnement à la mise en place.",
  },
  {
    question: "Puis-je la combiner avec la commande à emporter ?",
    answer:
      "Oui, avec KeepMe Complet : chaque commande retirée ajoute automatiquement un passage sur la carte du client, sans scan.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer:
      "Non. L'abonnement est sans engagement et résiliable à tout moment, avec 14 jours d'essai gratuit.",
  },
];

export default function CarteDeFidelitePage() {
  const essentiel = choiceInfo("fidelite:essentiel");
  const business = choiceInfo("fidelite:business");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1">
        <ProductHero
          eyebrow="KeepMe Card · Carte de fidélité"
          title="Carte de fidélité digitale pour votre restaurant"
          lead="Une carte à vos couleurs dans Apple Wallet ou Google Wallet. Vos clients cumulent des passages et reviennent, sans application ni carte papier."
          primary={{
            label: "Choisir KeepMe Card",
            href: "/signup?offre=fidelite",
          }}
          secondary={{ label: "Voir les tarifs", href: "#tarifs" }}
        />
        <CardShowcase />
        <HowItWorks />
        <Features />

        <section id="tarifs" className="bg-neutral-50 py-24">
          <div className="px-6 lg:px-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                Deux niveaux, sans engagement
              </h2>
              <p className="mt-4 text-lg text-neutral-500">
                Un abonnement mensuel fixe, sans limite de clients.
              </p>
            </Reveal>
            <div className="mx-auto mt-14 grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
              <OfferCard
                eyebrow={essentiel.name}
                price={essentiel.price}
                blurb={essentiel.description}
                features={essentiel.features}
                note="14 jours d'essai gratuit."
                cta={{
                  label: "Choisir Essentiel",
                  href: "/signup?offre=fidelite&niveau=essentiel",
                }}
              />
              <OfferCard
                highlighted
                badge="Le plus choisi"
                eyebrow={business.name}
                price={business.price}
                blurb={business.description}
                features={business.features}
                note="14 jours d'essai gratuit."
                cta={{
                  label: "Choisir Business",
                  href: "/signup?offre=fidelite&niveau=business",
                }}
              />
            </div>
            <p className="mx-auto mt-10 max-w-xl text-center text-sm text-neutral-500">
              Vous voulez aussi prendre des commandes ?{" "}
              <Link
                href="/commande-a-emporter"
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                Découvrez KeepMe Order
              </Link>{" "}
              ou{" "}
              <Link
                href="/#tarifs"
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                comparez les trois offres
              </Link>
              .
            </p>
          </div>
        </section>

        <Faq items={faq} />
        <CtaBand
          title="Faites revenir vos clients"
          text="Lancez votre carte de fidélité digitale en quelques minutes."
          cta={{ label: "Choisir KeepMe Card", href: "/signup?offre=fidelite" }}
        />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
