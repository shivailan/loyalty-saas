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

// Wallet n'existe que sur iPhone/iPad : on n'affiche le bouton que là.
// TODO avant lancement : remplacer par le badge officiel « Ajouter à Apple
// Wallet » fourni par Apple (obligatoire pour utiliser leur marque).
export function AddToWalletButton({ cardId }: { cardId: string }) {
  const visible = useSyncExternalStore(subscribe, isAppleDevice, () => false);
  if (!visible) return null;

  return (
    <a
      href={`/api/wallet/apple/${cardId}`}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      <span aria-hidden="true"></span>
      Ajouter à Apple Wallet
    </a>
  );
}
