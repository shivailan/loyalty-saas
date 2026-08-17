import { QrCode, ScanLine, Gift, BarChart3 } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

const features = [
  {
    icon: QrCode,
    title: "QR code unique",
    description:
      "Affiché en caisse, scanné en un instant par vos clients pour s'inscrire.",
  },
  {
    icon: ScanLine,
    title: "Scan en boutique",
    description:
      "Ajoutez un passage à la carte d'un client en une seconde, sans friction.",
  },
  {
    icon: Gift,
    title: "Récompenses automatiques",
    description:
      "Le seuil atteint, la récompense se débloque. Aucun calcul à faire.",
  },
  {
    icon: BarChart3,
    title: "Statistiques en temps réel",
    description:
      "Inscriptions, passages, clients actifs — suivez tout depuis votre tableau de bord.",
  },
];

export function Features() {
  return (
    <section id="fonctionnalites" className="bg-background py-32">
      <div className="px-6 lg:px-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Tout ce qu&apos;il faut, rien de superflu
          </h2>
          <p className="mt-5 text-lg text-neutral-500">
            Un tableau de bord pensé pour un commerçant, pas pour un
            développeur.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <RevealItem
                key={feature.title}
                className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-8 transition-colors duration-300 hover:border-neutral-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
