"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { LOCKED_MESSAGE } from "@/lib/features";
import { businessPrice } from "@/lib/plans";
import { upgradeToBusiness } from "@/app/subscribe/actions";
import { Button } from "@/components/ui/Button";

// Bouton « Télécharger (Excel) » cadenassé : un clic explique que l'option est
// incluse dans la formule Business et propose d'y passer.
export function LockedExportButton({ canUpgrade }: { canUpgrade: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        title={LOCKED_MESSAGE}
        className="group inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-500 transition hover:border-yellow-300 hover:bg-yellow-50"
      >
        <Lock className="h-4 w-4" aria-hidden="true" />
        Télécharger (Excel)
        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
          Business
        </span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Option Business"
          className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-lg"
        >
          <p className="text-sm font-semibold text-neutral-900">
            Export Excel : formule Business
          </p>
          <p className="mt-1 text-sm text-neutral-600">{LOCKED_MESSAGE}</p>
          {canUpgrade ? (
            <form action={upgradeToBusiness} className="mt-3">
              <Button type="submit" className="w-full">
                Passer à Business · {businessPrice} €/mois
              </Button>
            </form>
          ) : (
            <p className="mt-3 text-xs text-neutral-500">
              Rendez-vous dans « Abonnement » pour changer de formule.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
