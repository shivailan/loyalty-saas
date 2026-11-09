import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

type Cta = { label: string; href: string };

// En-tête d'une page produit : un titre qui dit exactement ce que fait le
// produit, une phrase d'explication et deux boutons.
export function ProductHero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primary: Cta;
  secondary: Cta;
}) {
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
      <div className="relative flex flex-col items-center px-6 pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
        <RevealGroup className="flex flex-col items-center">
          <RevealItem>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600">
              {eyebrow}
            </span>
          </RevealItem>
          <RevealItem>
            <h1 className="mx-auto mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg">
              {lead}
            </p>
          </RevealItem>
          <RevealItem className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href={primary.href}
              className="rounded-full bg-yellow-400 px-8 py-4 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
            >
              {primary.label}
            </Link>
            <a
              href={secondary.href}
              className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
            >
              {secondary.label}
            </a>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

// Bandeau de fin de page : un dernier appel à l'action.
export function CtaBand({
  title,
  text,
  cta,
}: {
  title: string;
  text: string;
  cta: Cta;
}) {
  return (
    <section className="bg-neutral-900 py-20 text-white">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg text-neutral-300">{text}</p>
        <Link
          href={cta.href}
          className="mt-8 rounded-full bg-yellow-400 px-8 py-4 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
        >
          {cta.label}
        </Link>
      </Reveal>
    </section>
  );
}
