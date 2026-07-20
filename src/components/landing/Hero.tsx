import Link from "next/link";
import { RevealGroup, RevealItem, RevealSide, FloatingCard } from "./Motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-yellow-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-yellow-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <RevealGroup>
            <RevealItem>
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                Pour restaurants, boulangeries, salons, garages...
              </span>
            </RevealItem>
            <RevealItem>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
                La carte de fidélité papier,{" "}
                <span className="bg-yellow-300 px-1">version digitale</span>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mt-6 text-lg text-neutral-600">
                Vos clients scannent un QR code, s&apos;inscrivent en 10
                secondes et gardent leur carte sur leur téléphone. Vous
                scannez, le passage s&apos;ajoute automatiquement — plus de
                tampons perdus.
              </p>
            </RevealItem>
            <RevealItem className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-lg bg-yellow-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
              >
                Essayer gratuitement
              </Link>
              <a
                href="#comment-ca-marche"
                className="text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
              >
                Voir comment ça marche →
              </a>
            </RevealItem>
          </RevealGroup>

          <RevealSide from="right" delay={0.15} className="flex justify-center">
            <FloatingCard>
              <div className="w-full max-w-xs rounded-[2rem] border border-neutral-200 bg-neutral-900 p-3 shadow-2xl">
                <div className="rounded-[1.5rem] bg-white p-5">
                  <p className="text-sm font-semibold text-neutral-900">
                    Boulangerie Martin
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Bonjour Julie
                  </p>

                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-medium text-neutral-700">
                      <span>6 / 8 passages</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-neutral-100">
                      <div className="h-2.5 w-3/4 rounded-full bg-yellow-400" />
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      Récompense : un café offert
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-sm ${
                            i % 5 === 0 ? "bg-neutral-900" : "bg-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[10px] text-neutral-400">
                    Présentez ce code au commerçant
                  </p>
                </div>
              </div>
            </FloatingCard>
          </RevealSide>
        </div>
      </div>
    </section>
  );
}
