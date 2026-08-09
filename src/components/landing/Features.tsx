import {
  QrCode,
  ScanLine,
  BarChart3,
  Gift,
  Smartphone,
  Settings2,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Motion";

const features = [
  { icon: QrCode, label: "QR code unique" },
  { icon: ScanLine, label: "Scan en boutique" },
  { icon: Settings2, label: "Règles sur-mesure" },
  { icon: Gift, label: "Récompenses automatiques" },
  { icon: BarChart3, label: "Statistiques en temps réel" },
  { icon: Smartphone, label: "Sans application à installer" },
];

export function Features() {
  return (
    <section id="fonctionnalites" className="bg-neutral-900 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:gap-16">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              Tout ce qu&apos;il faut, rien de superflu
            </h2>
            <p className="mt-4 max-w-sm text-neutral-300">
              Un tableau de bord pensé pour un commerçant, pas pour un
              développeur.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <RevealItem
                  key={feature.label}
                  className="group flex flex-col items-start text-left"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                    <Icon className="h-7 w-7 text-yellow-300" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-neutral-200">
                    {feature.label}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
