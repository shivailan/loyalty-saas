import { Reveal } from "./Motion";
import { CardMarquee } from "./CardMarquee";

export function CardShowcase() {
  return (
    <section className="bg-background py-28">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Un wallet, toutes leurs cartes
        </h2>
        <p className="mt-4 text-lg text-neutral-500">
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
