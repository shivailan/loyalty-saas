import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteCustomerButton } from "./DeleteCustomerButton";
import { LockedExportButton } from "./LockedExportButton";
import { hasFeature } from "@/lib/billing/access";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: customers } = await supabase
    .from("customers")
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      phone,
      marketing_consent,
      created_at,
      loyalty_cards ( current_stamps, loyalty_programs ( visits_required ) )
    `,
    )
    .order("created_at", { ascending: false });

  const count = customers?.length ?? 0;

  const { data: merchant } = await supabase
    .from("merchants")
    .select("billing_exempt, subscription_plan")
    .eq("owner_id", user.id)
    .single();
  const canExport = merchant ? hasFeature("customerExport", merchant) : false;
  // Le passage à Business se fait en un clic seulement pour un abonné Essentiel.
  const canUpgrade = merchant?.subscription_plan === "essentiel";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Clients</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {count} client{count > 1 ? "s" : ""} inscrit{count > 1 ? "s" : ""}.
          </p>
        </div>
        {count > 0 &&
          (canExport ? (
            <a
              href="/dashboard/clients/export"
              download
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Télécharger (Excel)
            </a>
          ) : (
            <LockedExportButton canUpgrade={canUpgrade} />
          ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
              <th className="px-4 py-3 font-medium">Passages</th>
              <th className="px-4 py-3 font-medium">Offres acceptées</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((customer) => {
              const card = customer.loyalty_cards[0];
              return (
                <tr
                  key={customer.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-3 text-neutral-900">
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {customer.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(customer.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {card
                      ? `${card.current_stamps} / ${card.loyalty_programs?.visits_required ?? "?"}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {customer.marketing_consent ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-3">
                    <DeleteCustomerButton
                      customerId={customer.id}
                      customerName={`${customer.first_name} ${customer.last_name}`}
                    />
                  </td>
                </tr>
              );
            })}
            {count === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-neutral-500"
                >
                  Aucun client pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
