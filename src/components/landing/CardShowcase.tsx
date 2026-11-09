import Link from "next/link";
import { Reveal } from "./Motion";
import { CardMarquee } from "./CardMarquee";

export function CardShowcase({ moreHref }: { moreHref?: string }) {
  return (
    <section id="fidelite" className="bg-background py-28">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
          KeepMe Card · en option ou seule
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Faites revenir vos clients avec une carte dans leur téléphone
        </h2>
        <p className="mt-4 text-lg text-neutral-500">
          Une carte de fidélité digitale à vos couleurs, rangée dans Apple
          Wallet ou Google Wallet, sans application ni carte papier.
        </p>
        {moreHref && (
          <Link
            href={moreHref}
            className="mt-6 inline-block text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
          >
            Découvrir KeepMe Card →
          </Link>
        )}
      </Reveal>

      <div className="mt-12">
        <CardMarquee />
      </div>
    </section>
  );
}
