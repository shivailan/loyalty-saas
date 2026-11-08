"use client";

import { useState, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function isAppleDevice(): boolean {
  const ua = navigator.userAgent;
  const iPadOnMac =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || iPadOnMac;
}

// Seul Safari remet le fichier de la carte à Wallet. Le navigateur intégré d'une
// application (scan de QR code de Google, réseaux sociaux, messagerie…) affiche
// le fichier comme du texte illisible.
function isSafari(): boolean {
  const ua = navigator.userAgent;
  return (
    /Safari\//.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|GSA\/|FBAN|FBAV|Instagram|Line\/|MicroMessenger|Snapchat|TikTok|Twitter|LinkedInApp|Pinterest/.test(
      ua,
    )
  );
}

// Wallet n'existe que sur iPhone/iPad : on n'affiche le badge que là.
// Le fichier SVG est le badge officiel français fourni par Apple : il ne doit
// être ni modifié, ni recoloré, ni déformé (voir les directives d'Apple).
export function AddToWalletButton({ cardId }: { cardId: string }) {
  const visible = useSyncExternalStore(subscribe, isAppleDevice, () => false);
  const safari = useSyncExternalStore(subscribe, isSafari, () => true);
  const [copied, setCopied] = useState(false);
  if (!visible) return null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Copie impossible : le message explique déjà quoi faire.
    }
  }

  return (
    <>
      {!safari && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p>
            Pour ajouter la carte à Wallet, ouvrez cette page dans{" "}
            <strong>Safari</strong> : ce navigateur ne sait pas le faire.
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="mt-2 font-medium underline"
          >
            {copied ? "Lien copié : collez-le dans Safari" : "Copier le lien"}
          </button>
        </div>
      )}
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
    </>
  );
}
