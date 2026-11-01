"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { errorClass, successClass } from "@/lib/ui";
import { createIntegrationKey, revokeIntegrationKey } from "./actions";

export function QtimeLinkForm({
  hint,
  createdAt,
}: {
  hint: string | null;
  createdAt: string | null;
}) {
  const [key, setKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const linked = Boolean(hint);

  async function generate() {
    if (
      linked &&
      !window.confirm(
        "L'ancienne clé cessera de fonctionner. Vous devrez coller la nouvelle dans Qtime. Continuer ?",
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    setCopied(false);
    const result = await createIntegrationKey();
    setBusy(false);
    if (result.error) setError(result.error);
    else setKey(result.key ?? null);
  }

  async function revoke() {
    if (!window.confirm("Couper la liaison avec Qtime ?")) return;
    setBusy(true);
    setError(null);
    const result = await revokeIntegrationKey();
    setBusy(false);
    if (result.error) setError(result.error);
    else setKey(null);
  }

  async function copy() {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
    } catch {
      setError("Copie impossible : sélectionnez la clé et copiez-la à la main.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-600">
        Si vous utilisez Qtime pour les commandes à emporter, chaque commande
        retirée peut ajouter automatiquement un passage sur la carte de
        fidélité du client (s&apos;il l&apos;a demandé en commandant).
      </p>

      {key ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-900">
            Copiez cette clé maintenant et collez-la dans Qtime. Elle ne sera
            plus affichée ensuite.
          </p>
          <code className="mt-2 block break-all rounded bg-white p-2 text-xs text-neutral-900">
            {key}
          </code>
          <Button type="button" onClick={copy} className="mt-2 w-fit">
            {copied ? "Copiée" : "Copier la clé"}
          </Button>
        </div>
      ) : linked ? (
        <p className={successClass}>
          Liaison active — clé se terminant par « {hint} »
          {createdAt
            ? `, créée le ${new Date(createdAt).toLocaleDateString("fr-FR")}`
            : ""}
          .
        </p>
      ) : (
        <p className="text-sm text-neutral-500">Aucune liaison pour le moment.</p>
      )}

      {error && <p className={errorClass}>{error}</p>}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={generate} disabled={busy} className="w-fit">
          {linked ? "Générer une nouvelle clé" : "Générer une clé de liaison"}
        </Button>
        {linked && (
          <button
            type="button"
            onClick={revoke}
            disabled={busy}
            className="text-sm text-neutral-600 underline disabled:opacity-50"
          >
            Couper la liaison
          </button>
        )}
      </div>
    </div>
  );
}
