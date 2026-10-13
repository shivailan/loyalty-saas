"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function isAndroidDevice(): boolean {
  return /Android/i.test(navigator.userAgent);
}

// Google Wallet n'est proposé que sur Android. Le fichier SVG est le badge
// officiel français fourni par Google : il ne doit être ni modifié, ni
// recoloré, ni déformé (voir les consignes de marque de Google Wallet).
export function AddToGoogleWalletButton({ cardId }: { cardId: string }) {
  const visible = useSyncExternalStore(subscribe, isAndroidDevice, () => false);
  if (!visible) return null;

  return (
    <a
      href={`/api/wallet/google/${cardId}`}
      className="mt-6 flex justify-center py-1"
      aria-label="Ajouter à Google Wallet"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wallet/add-to-google-wallet-fr.svg"
        alt="Ajouter à Google Wallet"
        className="h-12 w-auto"
      />
    </a>
  );
}
