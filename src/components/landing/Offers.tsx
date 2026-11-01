"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  COMMANDE_FEATURES,
  PRICE_CENTS,
  TIER_LABEL,
  completFeatures,
  fidelityCents,
  fidelityFeatures,
  formatPrice,
  savingCents,
  separateCents,
  type Tier,
} from "@/lib/offers";

const TIERS: Tier[] = ["essentiel", "business"];

type CardProps = {
  eyebrow: string;
  price: string;
  strike?: string;
  blurb: string;
  features: string[];
  note?: string;
  badge?: string;
  highlighted?: boolean;
  cta: { label: string; href: string; external?: boolean };
};

function OfferCard({
  eyebrow,
  price,
  strike,
  blurb,
  features,
  note,
  badge,
  highlighted,
  cta,
}: CardProps) {
  const ctaClass = `mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
    highlighted
      ? "bg-yellow-400 py-3.5 text-base text-neutral-900 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
      : "border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100"
  }`;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 ${
        highlighted
          ? "z-10 border-yellow-400 bg-neutral-900 text-white shadow-2xl ring-2 ring-yellow-400 lg:-my-4 lg:py-12"
          : "border-neutral-200 bg-white/70"
      }`}
    >
      {badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-900 shadow-sm">
          {badge}
        </span>
      )}
      <h3
        className={`font-heading text-xl font-semibold tracking-tight ${
          highlighted ? "text-white" : "text-neutral-900"
        }`}
      >
        {eyebrow}
      </h3>
      <p className={`mt-2 text-sm ${highlighted ? "text-neutral-300" : "text-neutral-500"}`}>
        {blurb}
      </p>
      <p
        className={`mt-6 flex items-baseline gap-1 ${
          highlighted ? "text-white" : "text-neutral-900"
        }`}
      >
        <span
          className={`font-semibold tracking-tight ${
            highlighted ? "text-5xl text-yellow-400" : "text-4xl"
          }`}
        >
          {price} €
        </span>
        <span className={`text-sm ${highlighted ? "text-neutral-300" : "text-neutral-500"}`}>
          / mois
        </span>
      </p>
      {strike && (
        <p className={`mt-1 text-xs ${highlighted ? "text-neutral-400" : "text-neutral-500"}`}>
          au lieu de <span className="line-through">{strike} €</span> séparément
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className={`flex items-start gap-2 text-sm ${
              highlighted ? "text-neutral-100" : "text-neutral-600"
            }`}
          >
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                highlighted ? "text-yellow-400" : "text-neutral-900"
              }`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {note && (
        <p className={`mt-5 text-xs ${highlighted ? "text-neutral-400" : "text-neutral-500"}`}>
          {note}
        </p>
      )}

      {cta.external ? (
        <a href={cta.href} className={ctaClass}>
          {cta.label}
        </a>
      ) : (
        <Link href={cta.href} className={ctaClass}>
          {cta.label}
        </Link>
      )}
    </div>
  );
}

// Les trois offres. Le niveau (Essentiel / Business) joue sur Fidélité et Complet.
export function Offers() {
  const [tier, setTier] = useState<Tier>("essentiel");

  return (
    <div>
      <div
        className="mx-auto flex w-fit items-center gap-1 rounded-full border border-neutral-200 bg-white p-1"
        role="group"
        aria-label="Niveau de fidélité"
      >
        {TIERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            aria-pressed={tier === t}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              tier === t
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Fidélité {TIER_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-5 lg:grid-cols-3">
        <OfferCard
          eyebrow="KeepMe Commande"
          price={formatPrice(PRICE_CENTS.commande)}
          blurb="Vos commandes à emporter, sans commission et sans file d'attente."
          features={COMMANDE_FEATURES}
          note="Options à la demande : paiement en ligne, accès aux données clients."
          cta={{ label: "Choisir Commande", href: "/signup?offre=commande" }}
        />
        <OfferCard
          highlighted
          badge={`Économisez ${formatPrice(savingCents(tier))} € par mois`}
          eyebrow="KeepMe Complet"
          price={formatPrice(PRICE_CENTS.complet[tier])}
          strike={formatPrice(separateCents(tier))}
          blurb="Commandes et fidélité qui travaillent ensemble : chaque commande retirée fidélise."
          features={completFeatures(tier)}
          cta={{ label: "Choisir Complet", href: `/signup?offre=complet&niveau=${tier}` }}
        />
        <OfferCard
          eyebrow={`KeepMe Fidélité ${TIER_LABEL[tier]}`}
          price={formatPrice(fidelityCents(tier))}
          blurb="Une carte de fidélité digitale dans le téléphone de vos clients."
          features={fidelityFeatures(tier)}
          note="14 jours d'essai gratuit."
          cta={{ label: "Choisir Fidélité", href: `/signup?offre=fidelite&niveau=${tier}` }}
        />
      </div>
    </div>
  );
}
