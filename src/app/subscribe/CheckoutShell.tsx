"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Entoure les formules : au premier clic sur un bouton de souscription, un
// voile couvre la page (plus aucun autre clic possible) avec un message clair,
// le temps que Stripe ouvre la page de paiement.
export function CheckoutShell({ children }: { children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);

  // Retour arrière depuis Stripe : la page revient figée telle qu'elle était,
  // on enlève le voile.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <div onSubmitCapture={() => setBusy(true)}>
      {children}
      {busy && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm"
        >
          <Loader2
            className="h-8 w-8 animate-spin text-yellow-500"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-neutral-900">
            Ouverture du paiement sécurisé…
          </p>
          <p className="text-sm text-neutral-600">
            Quelques secondes, vous allez être redirigé vers Stripe.
          </p>
        </div>
      )}
    </div>
  );
}
