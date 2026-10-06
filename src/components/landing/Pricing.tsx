import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

type Feature = { label: string; soon?: boolean };

type Plan = {
  name: string;
  price: string;
  description: string;
  features: Feature[];
  highlighted?: boolean;
  comingSoon?: boolean;
};

const plans: Plan[] = [
  {
    name: "Essentiel",
    price: "39,99",
    description: "Tout pour lancer votre carte de fidélité digitale.",
    features: [
      { label: "QR code et carte de fidélité illimités" },
      { label: "Clients et passages illimités" },
      { label: "Statistiques en temps réel" },
      { label: "Logo et couleurs de votre commerce" },
      { label: "Emails automatiques à vos clients" },
      { label: "Support par email" },
      { label: "Mise en place clé en main en option" },
      { label: "Notifications push", soon: true },
    ],
  },
  {
    name: "Business",
    price: "49,99",
    description: "Un accompagnement plus proche, dès le premier jour.",
    highlighted: true,
    features: [
      { label: "Tout ce qui est inclus dans Essentiel" },
      { label: "Support par WhatsApp" },
      { label: "Mise en place clé en main offerte" },
      { label: "Notifications push", soon: true },
    ],
  },
  {
    name: "Prochainement",
    price: "69,99",
    description: "Une offre plus complète arrive bientôt.",
    comingSoon: true,
    features: [],
  },
];

export function Pricing() {
  return (
    <section id="tarifs" className="bg-neutral-50 py-28">
      <div className="px-6 lg:px-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Des offres claires
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Un abonnement mensuel, sans limite de clients ni de passages.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.highlighted
                  ? "border-yellow-400 bg-white shadow-xl ring-1 ring-yellow-400"
                  : plan.comingSoon
                    ? "border-dashed border-neutral-300 bg-transparent"
                    : "border-neutral-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-neutral-900">
                  Recommandé
                </span>
              )}

              <h3 className="font-heading text-xl font-semibold tracking-tight text-neutral-900">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                {plan.description}
              </p>

              <p
                className={`mt-6 flex items-baseline gap-1 ${
                  plan.comingSoon ? "text-neutral-400" : "text-neutral-900"
                }`}
              >
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price} €
                </span>
                <span className="text-sm text-neutral-500">/ mois</span>
              </p>

              {plan.features.length > 0 && (
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className={`flex items-start gap-2 text-sm ${
                        feature.soon ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      {feature.soon ? (
                        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                      )}
                      <span>
                        {feature.label}
                        {feature.soon && " (bientôt)"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {plan.comingSoon ? (
                <p className="mt-8 rounded-full border border-neutral-200 px-4 py-3 text-center text-sm font-semibold text-neutral-400">
                  Bientôt disponible
                </p>
              ) : (
                <Link
                  href="/signup"
                  className={`mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                    plan.highlighted
                      ? "bg-yellow-400 text-neutral-900 hover:bg-yellow-300"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  Commencer
                </Link>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
