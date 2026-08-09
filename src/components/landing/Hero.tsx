import Link from "next/link";
import {
  RevealGroup,
  RevealItem,
  Reveal,
  FloatingCard,
  TiltCard,
  RotatingWord,
} from "./Motion";
import { PhoneWalletMockup } from "./PhoneWalletMockup";

const businessTypes = [
  "restaurants",
  "boulangeries",
  "salons",
  "garages",
  "commerces",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-4rem] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-400/30 via-amber-500/15 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid items-center gap-16 md:grid-cols-[1.05fr_1fr]">
          <RevealGroup>
            <RevealItem>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
                100% digital, zéro papier
              </span>
            </RevealItem>
            <RevealItem>
              <h1 className="mt-6 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
                La carte de fidélité
                <br />
                digitale pour vos{" "}
                <RotatingWord words={businessTypes} />
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mt-6 max-w-lg text-lg text-neutral-300">
                Fini les cartes en papier qu&apos;on froisse et qu&apos;on
                perd. Vos clients scannent un QR code, s&apos;inscrivent en
                10 secondes, et gardent leur carte dans leur poche — comme
                une carte Wallet.
              </p>
            </RevealItem>
            <RevealItem className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
              >
                Essayer gratuitement
              </Link>
              <a
                href="#comment-ca-marche"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Voir comment ça marche
              </a>
            </RevealItem>
          </RevealGroup>

          <Reveal
            delay={0.15}
            className="relative flex justify-center md:justify-end"
          >
            <TiltCard className="relative [transform-style:preserve-3d]">
              {/* Carte fantôme flottante derrière le téléphone */}
              <div
                aria-hidden="true"
                className="absolute -right-6 -top-8 hidden h-32 w-48 rotate-[18deg] rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-xl sm:block"
              >
                <div className="p-4">
                  <div className="h-2 w-16 rounded-full bg-white/15" />
                  <div className="mt-2 h-2 w-10 rounded-full bg-white/10" />
                </div>
              </div>

              <FloatingCard>
                <div className="relative rotate-3">
                  <PhoneWalletMockup />
                </div>
              </FloatingCard>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
