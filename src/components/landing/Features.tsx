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
    <section id="fonctionnalites" className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-neutral-900">
            Tout ce qu&apos;il faut, rien de superflu
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <RevealItem
                key={feature.label}
                className="group flex flex-col items-center text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                  <Icon className="h-7 w-7 text-yellow-700" />
                </div>
                <p className="mt-3 text-sm font-medium text-neutral-800">
                  {feature.label}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
