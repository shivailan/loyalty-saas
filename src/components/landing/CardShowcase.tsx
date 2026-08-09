import { Reveal } from "./Motion";
import { CardMarquee } from "./CardMarquee";

export function CardShowcase() {
  return (
    <section className="bg-neutral-900 py-20">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
          Un wallet, toutes leurs cartes
        </h2>
        <p className="mt-3 text-neutral-300">
          Chaque commerce a la sienne, personnalisée à ses couleurs — toutes
          rangées au même endroit dans le téléphone du client.
        </p>
      </Reveal>

      <div className="mt-12">
        <CardMarquee />
      </div>
    </section>
  );
}
