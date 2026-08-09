import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { MerchantsTable } from "./MerchantsTable";

export default async function AdminMerchantsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: merchants } = await supabase
    .from("merchants")
    .select("id, name, slug, is_suspended, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">
          Commerçants
        </h1>
        <p className="text-sm font-medium text-neutral-500">
          {(merchants ?? []).length} inscrit
          {(merchants ?? []).length > 1 ? "s" : ""}
        </p>
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        Suspendre bloque immédiatement l&apos;accès au dashboard du
        commerçant. Supprimer efface aussi ses clients, cartes et passages —
        irréversible.
      </p>
      <div className="mt-6">
        <MerchantsTable merchants={merchants ?? []} />
      </div>
    </div>
  );
}
