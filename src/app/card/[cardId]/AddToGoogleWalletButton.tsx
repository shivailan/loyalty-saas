"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function isAndroidDevice(): boolean {
  return /Android/i.test(navigator.userAgent);
}

// Google Wallet n'est proposé que sur Android.
// TODO avant lancement : remplacer par le bouton officiel « Ajouter à Google
// Wallet » fourni par Google (obligatoire pour utiliser leur marque).
export function AddToGoogleWalletButton({ cardId }: { cardId: string }) {
  const visible = useSyncExternalStore(subscribe, isAndroidDevice, () => false);
  if (!visible) return null;

  return (
    <a
      href={`/api/wallet/google/${cardId}`}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      Ajouter à Google Wallet
    </a>
  );
}
