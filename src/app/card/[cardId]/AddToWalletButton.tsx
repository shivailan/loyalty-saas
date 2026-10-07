"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function isAppleDevice(): boolean {
  const ua = navigator.userAgent;
  const iPadOnMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || iPadOnMac;
}

// Wallet n'existe que sur iPhone/iPad : on n'affiche le badge que là.
// Le fichier SVG est le badge officiel français fourni par Apple : il ne doit
// être ni modifié, ni recoloré, ni déformé (voir les directives d'Apple).
export function AddToWalletButton({ cardId }: { cardId: string }) {
  const visible = useSyncExternalStore(subscribe, isAppleDevice, () => false);
  if (!visible) return null;

  return (
    <a
      href={`/api/wallet/apple/${cardId}`}
      className="mt-6 flex justify-center py-1"
      aria-label="Ajouter à l’app Cartes Apple"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wallet/add-to-apple-wallet-fr.svg"
        alt="Ajouter à l’app Cartes Apple"
        className="h-12 w-auto"
      />
    </a>
  );
}
