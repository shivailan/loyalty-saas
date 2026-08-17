import { ArrowRight, QrCode, Smartphone } from "lucide-react";
import Link from "next/link";
import { HeroCardStack } from "./HeroCardStack";
import {
  FloatingCard,
  Reveal,
  RevealGroup,
  RevealItem,
  RotatingWord,
  TiltCard,
} from "./Motion";

const businessTypes = [
  "restaurants",
  "boulangeries",
  "salons",
  "garages",
  "commerces",
];

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

      <div
        className="pointer-events-none absolute -left-6 hidden lg:block"
        style={{ bottom: "6rem" }}
      >
        <FloatingCard>
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-2.5 pl-2.5 pr-4 shadow-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600">
              <QrCode className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-neutral-700">
              QR code unique
            </span>
          </div>
        </FloatingCard>
      </div>
      <div
        className="pointer-events-none absolute -right-6 hidden lg:block"
        style={{ bottom: "10rem" }}
      >
        <FloatingCard>
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-2.5 pl-2.5 pr-4 shadow-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600">
              <Smartphone className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-neutral-700">
              Sans application
            </span>
          </div>
        </FloatingCard>
      </div>

      <div className="flex flex-col items-center px-6 pt-16 text-center sm:pt-10">
        <RevealGroup className="flex flex-col items-center">
          <RevealItem>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              100% digital · Zéro papier
            </span>
          </RevealItem>
          <RevealItem>
            <h1 className="mx-auto mt-6 max-w-4xl font-heading text-6xl font-semibold leading-[0.98] tracking-tight text-neutral-900 sm:text-7xl lg:text-8xl">
              La carte de fidélité pour vos{" "}
              <RotatingWord words={businessTypes} />
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-7 max-w-xl text-xl leading-relaxed text-neutral-500">
              Fini les cartes en papier qu&apos;on froisse et qu&apos;on
              perd. Une carte digitale que vos clients gardent dans leur
              poche, comme dans Wallet.
            </p>
          </RevealItem>
          <RevealItem className="mt-9 flex items-center justify-center gap-8">
            <Link
              href="/signup"
              className="rounded-full bg-yellow-400 px-8 py-4 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
            >
              Essayer gratuitement
            </Link>
            <a
              href="#comment-ca-marche"
              className="group flex items-center gap-1.5 text-sm font-semibold text-neutral-900"
            >
              Voir comment ça marche
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </RevealItem>
        </RevealGroup>
      </div>

      <div className="relative mt-12 flex justify-center pb-16 sm:mt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.35),transparent_70%)] blur-3xl sm:h-[38rem] sm:w-[38rem]"
        />
        <Reveal delay={0.2} className="relative">
          <TiltCard className="[transform-style:preserve-3d]">
            <FloatingCard>
              <HeroCardStack />
            </FloatingCard>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
