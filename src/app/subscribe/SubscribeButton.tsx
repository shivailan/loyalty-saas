"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

// Bouton de souscription : dès le clic il passe en « chargement » (cercle qui
// tourne) pour montrer que la demande est partie pendant que la page de
// paiement Stripe s'ouvre. Doit être placé à l'intérieur du <form>.
export function SubscribeButton({
  highlighted,
  label,
}: {
  highlighted: boolean;
  label: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-wait disabled:opacity-90 ${
        highlighted
          ? "bg-yellow-400 text-neutral-900 hover:bg-yellow-300"
          : "bg-neutral-900 text-white hover:bg-neutral-700"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Ouverture du paiement…
        </>
      ) : (
        label
      )}
    </button>
  );
}
