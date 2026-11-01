import { ChefHat, Link2, QrCode, Smartphone } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

const points = [
  {
    icon: Smartphone,
    title: "Une vraie page de commande",
    description:
      "À votre nom et à vos couleurs. Le client commande depuis son téléphone, sans compte ni appli.",
  },
  {
    icon: ChefHat,
    title: "Un écran en cuisine",
    description:
      "Les commandes arrivent en direct avec une alerte sonore, et le ticket peut s'imprimer tout seul.",
  },
  {
    icon: QrCode,
    title: "Zéro commission",
    description:
      "Un abonnement fixe. Le paiement reste dans votre caisse et vos clients restent à vous.",
  },
  {
    icon: Link2,
    title: "Relié à la fidélité",
    description:
      "Chaque commande retirée ajoute un passage sur la carte du client. Sans scan, sans effort.",
  },
];

export function CommandeSection() {
  return (
    <section id="commande" className="bg-neutral-900 py-28 text-white">
      <div className="px-6 lg:px-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-400">
            Nouveau · KeepMe Commande
          </p>
          <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Fini le téléphone qui sonne à l&apos;heure de pointe
          </h2>
          <p className="mt-5 text-lg text-neutral-300">
            Restaurateurs : prenez vos commandes à emporter en ligne, gagnez du
            temps en cuisine et fidélisez vos clients au même endroit.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <RevealItem
                key={point.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400">
                  <Icon className="h-5 w-5 text-neutral-900" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight">
                  {point.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">
                  {point.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
