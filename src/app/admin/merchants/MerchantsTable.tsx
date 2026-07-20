"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setMerchantSuspended, deleteMerchant } from "./actions";
import { Button } from "@/components/ui/Button";

type Merchant = {
  id: string;
  name: string;
  slug: string;
  is_suspended: boolean;
  created_at: string;
};

export function MerchantsTable({ merchants }: { merchants: Merchant[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleToggleSuspend(merchant: Merchant) {
    setPendingId(merchant.id);
    await setMerchantSuspended(merchant.id, !merchant.is_suspended);
    setPendingId(null);
    router.refresh();
  }

  async function handleDelete(merchant: Merchant) {
    const confirmed = window.confirm(
      `Supprimer définitivement "${merchant.name}" et toutes ses données (clients, passages, récompenses) ? Cette action est irréversible.`,
    );
    if (!confirmed) return;

    setPendingId(merchant.id);
    await deleteMerchant(merchant.id);
    setPendingId(null);
    router.refresh();
  }

  if (merchants.length === 0) {
    return (
      <p className="text-sm text-neutral-600">Aucun commerçant pour l&apos;instant.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-500">
          <tr>
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Inscrit le</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr
              key={merchant.id}
              className="border-b border-neutral-100 last:border-0"
            >
              <td className="px-4 py-3 text-neutral-900">{merchant.name}</td>
              <td className="px-4 py-3 text-neutral-600">
                {new Date(merchant.created_at).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3">
                {merchant.is_suspended ? (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    Suspendu
                  </span>
                ) : (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Actif
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={pendingId === merchant.id}
                    onClick={() => handleToggleSuspend(merchant)}
                  >
                    {merchant.is_suspended ? "Réactiver" : "Suspendre"}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={pendingId === merchant.id}
                    onClick={() => handleDelete(merchant)}
                  >
                    Supprimer
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
