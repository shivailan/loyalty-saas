import { ArrowRight, Check, Percent, Smartphone } from "lucide-react";
import Link from "next/link";
import {
  PRICE_CENTS,
  fidelityCents,
  formatPrice,
  savingCents,
} from "@/lib/offers";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

// Aperçu de KeepMe Order : le ticket qui arrive en cuisine.
function OrderPreview() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-3 text-neutral-900 shadow-lg">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
          Commande
        </p>
        <p className="font-heading text-3xl font-semibold leading-none">027</p>
        <p className="mt-1 text-xs text-neutral-500">Retrait vers 12h35</p>
      </div>
      <ul className="hidden text-xs text-neutral-600 sm:block">
        <li>1× Tacos XL</li>
        <li>1× Frites</li>
        <li>1× Boisson</li>
      </ul>
      <span className="flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-semibold">
        <Check className="h-3 w-3" aria-hidden="true" />
        Prête
      </span>
    </div>
  );
}

// Aperçu de KeepMe Card : la carte de fidélité dans le téléphone du client.
function CardPreview() {
  return (
    <div className="rounded-2xl bg-yellow-400 p-3 text-neutral-900 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="font-heading text-sm font-semibold">Chez Karim</p>
        <p className="text-xs font-semibold">6 / 8 passages</p>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className={`h-5 flex-1 rounded-full ${
              i < 6 ? "bg-neutral-900" : "bg-neutral-900/15"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs">Récompense : un tacos offert</p>
    </div>
  );
}

type ProductProps = {
  dark?: boolean;
  name: string;
  kind: string;
  title: string;
  description: string;
  points: string[];
  price: string;
  preview: React.ReactNode;
  signup: string;
  learnMore: string;
};

function Product({
  dark = false,
  name,
  kind,
  title,
  description,
  points,
  price,
  preview,
  signup,
  learnMore,
}: ProductProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-3xl p-6 text-left ${
        dark
          ? "bg-neutral-900 text-white shadow-2xl"
          : "border border-neutral-200 bg-white text-neutral-900 shadow-xl"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-yellow-400" : "text-yellow-600"
        }`}
      >
        {name} · {kind}
      </p>
      <h2 className="mt-2 font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p
        className={`mt-2 text-[15px] leading-relaxed ${
          dark ? "text-neutral-300" : "text-neutral-500"
        }`}
      >
        {description}
      </p>

      <div className="mt-4">{preview}</div>

      <ul className="mt-4 space-y-1.5">
        {points.map((point) => (
          <li
            key={point}
            className={`flex items-start gap-2.5 text-sm ${
              dark ? "text-neutral-100" : "text-neutral-700"
            }`}
          >
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                dark ? "text-yellow-400" : "text-yellow-600"
              }`}
              aria-hidden="true"
            />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-5">
        <p
          className={`text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}
        >
          À partir de{" "}
          <span className="font-heading text-2xl font-semibold">{price} €</span>{" "}
          / mois
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href={signup}
            className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
          >
            Choisir {name}
          </Link>
          <a
            href={learnMore}
            className="group flex items-center gap-1.5 text-sm font-semibold"
          >
            En savoir plus
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-yellow-50/60 via-background to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,23,0.05)_1px,transparent_0)] [background-size:26px_26px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.18),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(23,23,23,0.06),transparent_70%)] blur-3xl"
      />

      <div className="relative flex flex-col items-center px-6 pt-8 text-center sm:pt-8">
        <RevealGroup className="flex flex-col items-center">
          <RevealItem>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Pour les restaurateurs
            </span>
          </RevealItem>
          <RevealItem>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Gagnez du temps en cuisine.{" "}
              <span className="text-yellow-500">Fidélisez vos clients.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-3 max-w-4xl text-base leading-relaxed text-neutral-500 sm:text-lg">
              KeepMe réunit deux outils simples pour les restaurants : la
              commande à emporter avec <strong>KeepMe Order</strong>, et la
              carte de fidélité avec <strong>KeepMe Card</strong>. Sans
              commission, et sans application pour vos clients.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>

      <div className="relative mx-auto mt-6 grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        <Reveal className="h-full">
          <Product
            dark
            name="KeepMe Order"
            kind="Commande à emporter"
            title="Gagnez un temps énorme"
            description="Vos clients commandent sur votre page, la commande arrive directement en cuisine. Fini le téléphone qui sonne en plein coup de feu."
            points={[
              "Une page de commande à votre nom et vos couleurs",
              "Écran cuisine en direct, ticket imprimé tout seul",
              "0 % de commission, vos clients restent à vous",
            ]}
            price={formatPrice(PRICE_CENTS.commande)}
            preview={<OrderPreview />}
            signup="/signup?offre=commande"
            learnMore="#commande"
          />
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <Product
            name="KeepMe Card"
            kind="Carte de fidélité"
            title="Vos clients reviennent"
            description="Une carte de fidélité dans Apple Wallet ou Google Wallet : vos clients cumulent des passages, rien à installer."
            points={[
              "Une carte à vos couleurs dans le téléphone du client",
              "Inscription en 20 secondes avec un QR code en caisse",
              "Statistiques en temps réel et e-mails automatiques",
            ]}
            price={formatPrice(fidelityCents("essentiel"))}
            preview={<CardPreview />}
            signup="/signup?offre=fidelite"
            learnMore="#fidelite"
          />
        </Reveal>
      </div>

      <Reveal
        delay={0.15}
        className="relative mx-auto mt-4 max-w-6xl px-6 pb-10"
      >
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-yellow-300 bg-yellow-50 px-6 py-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-heading text-xl font-semibold text-neutral-900">
              Les deux ensemble : KeepMe Complet
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Chaque commande retirée ajoute un passage sur la carte du client,
              sans scan. À partir de{" "}
              {formatPrice(PRICE_CENTS.complet.essentiel)} € / mois, soit{" "}
              {formatPrice(savingCents("essentiel"))} € d&apos;économie.
            </p>
          </div>
          <Link
            href="#tarifs"
            className="shrink-0 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-neutral-700 active:scale-[0.98]"
          >
            Voir les offres
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-neutral-500">
          <li className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-yellow-600" aria-hidden="true" />0
            % de commission
          </li>
          <li className="flex items-center gap-2">
            <Smartphone
              className="h-4 w-4 text-yellow-600"
              aria-hidden="true"
            />
            Sans application pour le client
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-yellow-600" aria-hidden="true" />
            Sans engagement
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
