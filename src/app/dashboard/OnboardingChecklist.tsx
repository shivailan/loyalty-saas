import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export type OnboardingStep = {
  key: string;
  title: string;
  description: string;
  done: boolean;
  actionLabel: string;
  href: string;
  external?: boolean;
  hint?: string;
};

// Guide de démarrage : chaque étape se coche toute seule à partir des données
// du commerçant. L'étape en cours est mise en avant avec son bouton.
export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const doneCount = steps.filter((step) => step.done).length;
  const currentIndex = steps.findIndex((step) => !step.done);
  const percent = Math.round((doneCount / steps.length) * 100);

  return (
    <section
      aria-labelledby="onboarding-title"
      className="rounded-2xl border border-yellow-300 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="onboarding-title"
          className="text-lg font-bold text-neutral-900"
        >
          Démarrez en {steps.length} étapes
        </h2>
        <p className="text-sm font-medium text-neutral-500">
          {doneCount} sur {steps.length} terminées
        </p>
      </div>
      <div
        className="mt-3 h-2 w-full rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-2 rounded-full bg-yellow-400 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-5 flex flex-col gap-3">
        {steps.map((step, index) => {
          const current = index === currentIndex;
          return (
            <li
              key={step.key}
              className={`rounded-xl border p-4 ${
                current
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.done
                      ? "bg-emerald-500 text-white"
                      : current
                        ? "bg-yellow-400 text-neutral-900"
                        : "bg-neutral-100 text-neutral-500"
                  }`}
                  aria-hidden="true"
                >
                  {step.done ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-semibold ${
                      step.done
                        ? "text-neutral-400 line-through"
                        : "text-neutral-900"
                    }`}
                  >
                    {step.title}
                    {step.done && <span className="sr-only"> (terminée)</span>}
                  </h3>
                  {!step.done && (
                    <p className="mt-1 text-sm text-neutral-600">
                      {step.description}
                    </p>
                  )}
                  {!step.done && step.hint && (
                    <p className="mt-1 text-xs text-neutral-500">{step.hint}</p>
                  )}
                  {current && (
                    <Link
                      href={step.href}
                      target={step.external ? "_blank" : undefined}
                      rel={step.external ? "noopener noreferrer" : undefined}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-yellow-300"
                    >
                      {step.actionLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                  {!step.done && !current && (
                    <Link
                      href={step.href}
                      target={step.external ? "_blank" : undefined}
                      rel={step.external ? "noopener noreferrer" : undefined}
                      className="mt-2 inline-block text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
                    >
                      {step.actionLabel}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
