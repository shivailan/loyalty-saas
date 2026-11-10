import { Check } from "lucide-react";
import Link from "next/link";
import { PRICE_CENTS, fidelityCents, formatPrice } from "@/lib/offers";
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
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className={`h-5 flex-1 rounded-full ${
              i < 6 ? "bg-neutral-900" : "bg-neutral-900/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type ProductProps = {
  dark?: boolean;
  name: string;
  title: string;
  description: string;
  price: string;
  preview: React.ReactNode;
  signup: string;
};

function Product({
  dark = false,
  name,
  title,
  description,
  price,
  preview,
  signup,
}: ProductProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-3xl p-7 text-left ${
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
        {name}
      </p>
      <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight">
        {title}
      </h2>
      <p
        className={`mt-2 text-[15px] leading-relaxed ${
          dark ? "text-neutral-300" : "text-neutral-500"
        }`}
      >
        {description}
      </p>

      <div className="mt-6">{preview}</div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-7">
        <p
          className={`text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}
        >
          Dès{" "}
          <span className="font-heading text-2xl font-semibold">{price} €</span>{" "}
          / mois
        </p>
        <Link
          href={signup}
          className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
        >
          Choisir {name}
        </Link>
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

      <div className="relative flex flex-col items-center px-6 pt-14 text-center sm:pt-16">
        <RevealGroup className="flex flex-col items-center">
          <RevealItem>
            <h1 className="mx-auto max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Gagnez du temps en cuisine.{" "}
              <span className="text-yellow-500">Fidélisez vos clients.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg">
              La solution pour{" "}
              <strong className="font-semibold text-neutral-900">
                augmenter votre chiffre d&apos;affaires
              </strong>{" "}
              : plus de commandes, des clients qui reviennent. Sans commission
              et sans application pour vos clients.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>

      <div className="relative mx-auto mt-10 grid max-w-5xl gap-6 px-6 md:grid-cols-2">
        <Reveal className="h-full">
          <Product
            dark
            name="KeepMe Order"
            title="Gagnez un temps énorme"
            description="Vos clients commandent en ligne, la commande arrive en cuisine. Fini le téléphone qui sonne en plein coup de feu."
            price={formatPrice(PRICE_CENTS.commande)}
            preview={<OrderPreview />}
            signup="/signup?offre=commande"
          />
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <Product
            name="KeepMe Card"
            title="Vos clients reviennent"
            description="Une carte de fidélité dans le téléphone de vos clients, sans application à installer."
            price={formatPrice(fidelityCents("essentiel"))}
            preview={<CardPreview />}
            signup="/signup?offre=fidelite"
          />
        </Reveal>
      </div>

      <Reveal delay={0.15} className="relative px-6 pb-14 pt-8">
        <p className="text-center text-sm text-neutral-500">
          Les deux ensemble avec{" "}
          <strong className="text-neutral-900">KeepMe Complet</strong> : un seul
          abonnement, moins cher que les deux séparés.{" "}
          <Link
            href="#tarifs"
            className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
          >
            Voir les offres
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
