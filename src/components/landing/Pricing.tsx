import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "./Motion";

const included = [
  "QR code et carte de fidélité illimités",
  "Clients et passages illimités",
  "Statistiques en temps réel",
  "Sans engagement",
];

export function Pricing() {
  return (
    <section id="tarifs" className="bg-neutral-50 py-28">
      <div className="mx-auto max-w-md px-6 text-center">
        <Reveal>
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-neutral-900">
            Une offre simple
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Un seul abonnement, pas de paliers cachés. Le tarif sera annoncé
            au lancement.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8 text-left shadow-xl transition-colors hover:border-neutral-300">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Bientôt disponible
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              Tarif à venir
            </p>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block rounded-full bg-yellow-400 px-4 py-3 text-center text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.02] hover:bg-yellow-300 active:scale-[0.98]"
            >
              Essayer gratuitement
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
