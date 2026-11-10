"use client";

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

export function OfferCard({
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
      <p
        className={`mt-2 text-sm ${highlighted ? "text-neutral-300" : "text-neutral-500"}`}
      >
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
        <span
          className={`text-sm ${highlighted ? "text-neutral-300" : "text-neutral-500"}`}
        >
          / mois
        </span>
      </p>
      {strike && (
        <p
          className={`mt-1 text-xs ${highlighted ? "text-neutral-400" : "text-neutral-500"}`}
        >
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
        <p
          className={`mt-5 text-xs ${highlighted ? "text-neutral-400" : "text-neutral-500"}`}
        >
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

// ---------------------------------------------------------------------------
// Section tarifs : tous les prix d'un coup, rangés en trois étapes (Order,
// Card, les deux), avec les niveaux Essentiel et Business côte à côte.
// ---------------------------------------------------------------------------
type Option = {
  label: string;
  price: string;
  strike?: string;
  note?: string;
  badge?: string;
  cta: { label: string; href: string };
};

function OptionBox({ option, dark }: { option: Option; dark: boolean }) {
  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col rounded-2xl border p-5 ${
        dark ? "border-white/15 bg-white/5" : "border-neutral-200 bg-neutral-50"
      }`}
    >
      {option.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-neutral-900">
          {option.badge}
        </span>
      )}
      <p
        className={`text-xs font-semibold uppercase tracking-[0.15em] ${
          dark ? "text-yellow-400" : "text-neutral-500"
        }`}
      >
        {option.label}
      </p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="whitespace-nowrap font-heading text-3xl font-semibold tracking-tight">
          {option.price} €
        </span>
        <span
          className={`whitespace-nowrap text-sm ${dark ? "text-neutral-300" : "text-neutral-500"}`}
        >
          / mois
        </span>
      </p>
      {option.strike && (
        <p
          className={`mt-1 text-xs ${dark ? "text-neutral-400" : "text-neutral-500"}`}
        >
          au lieu de <span className="line-through">{option.strike} €</span>{" "}
          séparément
        </p>
      )}
      {option.note && (
        <p
          className={`mt-1 text-xs ${dark ? "text-neutral-400" : "text-neutral-500"}`}
        >
          {option.note}
        </p>
      )}
      <Link
        href={option.cta.href}
        className={`mt-4 block rounded-full px-4 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
          dark || option.badge
            ? "bg-yellow-400 text-neutral-900 hover:bg-yellow-300"
            : "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
        }`}
      >
        {option.cta.label}
      </Link>
    </div>
  );
}

function ProductRow({
  step,
  need,
  name,
  description,
  features,
  options,
  dark = false,
  badge,
}: {
  step: number;
  need: string;
  name: string;
  description: string;
  features: string[];
  options: Option[];
  dark?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl border p-6 sm:p-8 ${
        dark
          ? "border-yellow-400 bg-neutral-900 text-white shadow-2xl ring-2 ring-yellow-400"
          : "border-neutral-200 bg-white"
      }`}
    >
      {badge && (
        <span className="absolute -top-3.5 left-8 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-900 shadow-sm">
          {badge}
        </span>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-semibold text-neutral-900">
              {step}
            </span>
            <p
              className={`text-sm font-semibold ${
                dark ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              {need}
            </p>
          </div>
          <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight">
            {name}
          </h3>
          <p
            className={`mt-2 max-w-md text-[15px] leading-relaxed ${
              dark ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            {description}
          </p>
          <details className="group mt-4">
            <summary
              className={`inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold underline underline-offset-4 [&::-webkit-details-marker]:hidden ${
                dark ? "text-white" : "text-neutral-900"
              }`}
            >
              Voir ce qui est inclus
            </summary>
            <ul className="mt-3 space-y-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-start gap-2 text-sm ${
                    dark ? "text-neutral-100" : "text-neutral-600"
                  }`}
                >
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      dark ? "text-yellow-400" : "text-neutral-900"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row lg:w-[28rem]">
          {options.map((option) => (
            <OptionBox key={option.label} option={option} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Les offres, de la plus simple à la plus complète. Order n'a qu'un niveau ;
// Card et Complet existent en Essentiel et en Business.
export function Offers() {
  const tiers: Tier[] = ["essentiel", "business"];
  const businessExtras = fidelityFeatures("business").filter(
    (feature) => !feature.startsWith("Tout ce qui"),
  );

  return (
    <div>
      <p className="mx-auto max-w-2xl text-center text-sm text-neutral-500">
        <strong className="text-neutral-900">Pas sûr ?</strong> Order si vous
        voulez recevoir des commandes, Card si vous voulez fidéliser vos
        clients, Complet pour faire les deux.
      </p>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-6">
        <ProductRow
          step={1}
          need="Je veux recevoir des commandes"
          name="KeepMe Order"
          description="Vos commandes à emporter, sans commission et sans file d'attente."
          features={COMMANDE_FEATURES}
          options={[
            {
              label: "Une seule formule",
              price: formatPrice(PRICE_CENTS.commande),
              note: "Options à la demande : paiement en ligne, accès aux données clients.",
              cta: { label: "Choisir Order", href: "/signup?offre=commande" },
            },
          ]}
        />

        <ProductRow
          step={2}
          need="Je veux fidéliser mes clients"
          name="KeepMe Card"
          description="Une carte de fidélité digitale dans le téléphone de vos clients."
          features={fidelityFeatures("essentiel")}
          options={tiers.map((tier) => ({
            label: TIER_LABEL[tier],
            price: formatPrice(fidelityCents(tier)),
            note: "14 jours d'essai gratuit.",
            badge: tier === "business" ? "Le plus choisi" : undefined,
            cta: {
              label: `Choisir ${TIER_LABEL[tier]}`,
              href: `/signup?offre=fidelite&niveau=${tier}`,
            },
          }))}
        />

        <ProductRow
          dark
          step={3}
          need="Je veux les deux"
          name="KeepMe Complet : le full package"
          badge={`Économisez ${formatPrice(savingCents("essentiel"))} € par mois`}
          description="Commandes et fidélité dans un seul abonnement, moins cher que les deux séparés."
          features={completFeatures("essentiel")}
          options={tiers.map((tier) => ({
            label: TIER_LABEL[tier],
            price: formatPrice(PRICE_CENTS.complet[tier]),
            strike: formatPrice(separateCents(tier)),
            cta: {
              label: `Choisir ${TIER_LABEL[tier]}`,
              href: `/signup?offre=complet&niveau=${tier}`,
            },
          }))}
        />
      </div>

      <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-neutral-900">
          Essentiel ou Business ?
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Le niveau s&apos;applique à KeepMe Card et à KeepMe Complet. Order
          n&apos;a qu&apos;une formule.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
              Essentiel
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Tout pour lancer votre carte de fidélité.
            </p>
            <ul className="mt-3 space-y-2">
              {fidelityFeatures("essentiel").map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-yellow-600">
              Business
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Tout Essentiel, plus :
            </p>
            <ul className="mt-3 space-y-2">
              {businessExtras.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
