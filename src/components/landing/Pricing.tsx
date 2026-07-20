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
    <section id="tarifs" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-md px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-neutral-900">
            Une offre simple
          </h2>
          <p className="mt-3 text-neutral-600">
            Un seul abonnement, pas de paliers cachés. Le tarif sera annoncé
            au lancement.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-lg">
            <p className="text-sm font-semibold text-yellow-700">
              Bientôt disponible
            </p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">
              Tarif à venir
            </p>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block rounded-lg bg-yellow-400 px-4 py-3 text-center text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.02] hover:bg-yellow-300 active:scale-[0.98]"
            >
              Essayer gratuitement
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
