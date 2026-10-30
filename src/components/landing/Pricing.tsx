import Link from "next/link";
import { Check, X } from "lucide-react";
import { plans } from "@/lib/plans";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

export function Pricing() {
  return (
    <section id="tarifs" className="bg-neutral-50 py-28">
      <div className="px-6 lg:px-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Des offres claires
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Un abonnement mensuel, sans limite de clients ni de passages.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-3xl items-stretch gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <RevealItem
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.highlighted
                  ? "z-10 border-yellow-400 bg-neutral-900 text-white shadow-2xl ring-2 ring-yellow-400 md:-my-4 md:py-12"
                  : "border-neutral-200 bg-white/70"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-900 shadow-sm">
                  Le plus choisi
                </span>
              )}

              <h3
                className={`font-heading text-xl font-semibold tracking-tight ${
                  plan.highlighted ? "text-white" : "text-neutral-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-2 text-sm ${
                  plan.highlighted ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                {plan.description}
              </p>

              <p
                className={`mt-6 flex items-baseline gap-1 ${
                  plan.highlighted ? "text-white" : "text-neutral-900"
                }`}
              >
                <span
                  className={`font-semibold tracking-tight ${
                    plan.highlighted ? "text-5xl text-yellow-400" : "text-4xl"
                  }`}
                >
                  {plan.price} €
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  / mois
                </span>
              </p>

              {plan.features.length > 0 && (
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className={`flex items-start gap-2 text-sm ${
                        feature.excluded
                          ? "text-neutral-400 line-through"
                          : plan.highlighted
                            ? "text-neutral-100"
                            : "text-neutral-600"
                      }`}
                    >
                      {feature.excluded ? (
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            plan.highlighted
                              ? "text-yellow-400"
                              : "text-neutral-900"
                          }`}
                        />
                      )}
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/signup"
                className={`mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  plan.highlighted
                    ? "bg-yellow-400 py-3.5 text-base text-neutral-900 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
                    : "border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {plan.highlighted ? "Choisir Business" : "Choisir Essentiel"}
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-400">
          Prix en euros par mois, TVA non applicable (art. 293 B du CGI). Sans
          engagement, résiliable à tout moment.{" "}
          <Link
            href="/cgv"
            className="underline transition-colors hover:text-neutral-900"
          >
            Conditions générales de vente
          </Link>
        </p>
      </div>
    </section>
  );
}
