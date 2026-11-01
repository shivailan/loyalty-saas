import Link from "next/link";
import { Reveal } from "./Motion";
import { Offers } from "./Offers";

export function Pricing() {
  return (
    <section id="tarifs" className="bg-neutral-50 py-28">
      <div className="px-6 lg:px-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Commandes, fidélité, ou les deux
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Un abonnement mensuel fixe, sans commission, sans limite de clients
            ni de commandes.
          </p>
        </Reveal>

        <div className="mt-12">
          <Offers />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-400">
          Prix en euros par mois, TVA non applicable (art. 293 B du CGI). Sans
          engagement, résiliable à tout moment. Une offre Premium (notification
          de proximité, notifications illimitées) est prévue pour la fidélité.{" "}
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
