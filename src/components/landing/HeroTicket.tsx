import { Check } from "lucide-react";

// Visuel du héros : le ticket d'une commande à emporter et son avancement.
const lines: [string, string][] = [
  ["1× Tacos XL", "9,50 €"],
  ["1× Frites", "3,00 €"],
  ["1× Boisson", "2,00 €"],
];

const steps = ["Reçue", "En préparation", "Prête"];

export function HeroTicket() {
  return (
    <div className="relative w-[320px] sm:w-[360px]">
      <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-2xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Numéro de commande
        </p>
        <p className="mt-1 text-center font-heading text-6xl font-semibold text-neutral-900">
          027
        </p>
        <p className="mt-1 text-center text-sm text-neutral-500">
          Retrait vers 12h35 · Chez Karim
        </p>

        <ul className="mt-6 space-y-2 border-y border-dashed border-neutral-200 py-4 text-sm text-neutral-700">
          {lines.map(([name, price]) => (
            <li key={name} className="flex justify-between">
              <span>{name}</span>
              <span className="font-medium">{price}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between text-sm font-semibold text-neutral-900">
          <span>À payer sur place</span>
          <span>14,50 €</span>
        </p>

        <div className="mt-6 flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const done = index === steps.length - 1;
            return (
              <span
                key={step}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  done
                    ? "bg-yellow-400 text-neutral-900"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {done && <Check className="h-3 w-3" aria-hidden="true" />}
                {step}
              </span>
            );
          })}
        </div>
      </div>

      <div className="absolute -bottom-6 -right-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-xl sm:-right-10">
        <p className="text-[11px] font-semibold text-neutral-400">E-mail · à l&apos;instant</p>
        <p className="text-sm font-semibold text-neutral-900">C&apos;est prêt ! Commande 027</p>
      </div>
    </div>
  );
}
