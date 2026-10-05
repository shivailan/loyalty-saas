"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "./actions";

export function DeleteCustomerButton({
  customerId,
  customerName,
}: {
  customerId: string;
  customerName: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer définitivement ${customerName} ainsi que sa carte, ses passages et ses récompenses ? Cette action est irréversible.`,
    );
    if (!confirmed) return;

    setIsPending(true);
    setError(null);
    const result = await deleteCustomer(customerId);
    setIsPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-medium text-red-600 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Suppression..." : "Supprimer"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
