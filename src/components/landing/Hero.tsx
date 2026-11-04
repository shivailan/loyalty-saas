import { ArrowRight, ChefHat, Gift, Percent, Smartphone } from "lucide-react";
import Link from "next/link";
import { HeroTicket } from "./HeroTicket";
import {
  FloatingCard,
  Reveal,
  RevealGroup,
  RevealItem,
  TiltCard,
} from "./Motion";

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
              <Percent className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-neutral-700">
              0 % de commission
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
              Sans application pour le client
            </span>
          </div>
        </FloatingCard>
      </div>
      <div
        className="pointer-events-none absolute -left-10 hidden lg:block"
        style={{ top: "9rem" }}
      >
        <FloatingCard>
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-2.5 pl-2.5 pr-4 shadow-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600">
              <ChefHat className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-neutral-700">
              Écran cuisine en direct
            </span>
          </div>
        </FloatingCard>
      </div>
      <div
        className="pointer-events-none absolute -right-10 hidden lg:block"
        style={{ top: "15rem" }}
      >
        <FloatingCard>
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-2.5 pl-2.5 pr-4 shadow-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600">
              <Gift className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-neutral-700">
              Fidélité en option
            </span>
          </div>
        </FloatingCard>
      </div>

      <div className="flex flex-col items-center px-6 pt-16 text-center sm:pt-10">
        <RevealGroup className="flex flex-col items-center">
          <RevealItem>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Pour les restaurateurs · Commande à emporter
            </span>
          </RevealItem>
          <RevealItem>
            <h1 className="mx-auto mt-6 max-w-4xl font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
              Vos commandes à emporter arrivent toutes seules
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-7 max-w-xl text-xl leading-relaxed text-neutral-500">
              Une page de commande à votre nom, un écran en cuisine et zéro
              commission : vos clients commandent sans application et restent
              les vôtres. En option, une carte de fidélité digitale qui les
              fait revenir.
            </p>
          </RevealItem>
          <RevealItem className="mt-9 flex items-center justify-center gap-8">
            <Link
              href="#tarifs"
              className="rounded-full bg-yellow-400 px-8 py-4 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
            >
              Voir les offres
            </Link>
            <a
              href="#commande"
              className="group flex items-center gap-1.5 text-sm font-semibold text-neutral-900"
            >
              Découvrir KeepMe Commande
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
              <HeroTicket />
            </FloatingCard>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
