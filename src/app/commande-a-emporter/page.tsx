import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ProductHero, CtaBand } from "@/components/landing/ProductHero";
import { OrderSteps } from "@/components/landing/OrderSteps";
import { CommandeSection } from "@/components/landing/CommandeSection";
import { OfferCard } from "@/components/landing/Offers";
import { Faq, type FaqItem } from "@/components/landing/Faq";
import { Reveal } from "@/components/landing/Motion";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";
import { PRICE_CENTS, choiceInfo, formatPrice } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Commande à emporter sans commission pour restaurant — KeepMe Order",
  description:
    "KeepMe Order : une page de commande à votre nom, un écran en cuisine et zéro commission. Vos clients commandent sans application, vous gagnez un temps énorme.",
  alternates: { canonical: "/commande-a-emporter" },
};

const faq: FaqItem[] = [
  {
    question: "Faut-il payer une commission sur les commandes ?",
    answer: `Non. KeepMe Order est un abonnement mensuel fixe, à partir de ${formatPrice(PRICE_CENTS.commande)} € par mois. Il n'y a aucune commission sur vos commandes : le paiement reste dans votre caisse et vos clients restent les vôtres.`,
  },
  {
    question: "Mes clients doivent-ils installer une application ?",
    answer:
      "Non. Ils commandent depuis le navigateur de leur téléphone, sans compte et sans application à télécharger.",
  },
  {
    question: "Comment je reçois les commandes ?",
    answer:
      "Sur un écran en cuisine, en direct, avec une alerte sonore. Le ticket peut aussi s'imprimer automatiquement.",
  },
  {
    question: "Puis-je modifier ma carte et mes prix moi-même ?",
    answer:
      "Oui. Votre carte, vos prix et vos ruptures se modifient à tout moment, et le changement s'applique immédiatement à la page de commande.",
  },
  {
    question: "Puis-je ajouter une carte de fidélité ?",
    answer:
      "Oui, avec KeepMe Complet : chaque commande retirée ajoute automatiquement un passage sur la carte de fidélité du client, sans scan.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer:
      "Non. L'abonnement est sans engagement et résiliable à tout moment.",
  },
];

export default function CommandeAEmporterPage() {
  const order = choiceInfo("commande");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1">
        <ProductHero
          eyebrow="KeepMe Order · Commande à emporter"
          title="Commande à emporter sans commission pour votre restaurant"
          lead="Vos clients commandent sur une page à votre nom, la commande arrive directement en cuisine. Fini le téléphone qui sonne en plein coup de feu : vous gagnez un temps énorme."
          primary={{
            label: "Choisir KeepMe Order",
            href: "/signup?offre=commande",
          }}
          secondary={{ label: "Voir le tarif", href: "#tarifs" }}
        />
        <OrderSteps />
        <CommandeSection />

        <section id="tarifs" className="bg-neutral-50 py-24">
          <div className="px-6 lg:px-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                Un tarif simple, sans commission
              </h2>
              <p className="mt-4 text-lg text-neutral-500">
                Un abonnement mensuel fixe, sans limite de commandes.
              </p>
            </Reveal>
            <div className="mx-auto mt-12 max-w-md">
              <OfferCard
                highlighted
                eyebrow={order.name}
                price={order.price}
                blurb={order.description}
                features={order.features}
                note="Options à la demande : paiement en ligne, accès aux données clients."
                cta={{
                  label: "Choisir KeepMe Order",
                  href: "/signup?offre=commande",
                }}
              />
            </div>
            <p className="mx-auto mt-10 max-w-xl text-center text-sm text-neutral-500">
              Vous voulez aussi fidéliser vos clients ?{" "}
              <Link
                href="/carte-de-fidelite"
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                Découvrez KeepMe Card
              </Link>{" "}
              ou{" "}
              <Link
                href="/tarifs"
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
          title="Prêt à recevoir vos commandes sans commission ?"
          text="Créez votre page de commande en quelques minutes."
          cta={{
            label: "Choisir KeepMe Order",
            href: "/signup?offre=commande",
          }}
        />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
