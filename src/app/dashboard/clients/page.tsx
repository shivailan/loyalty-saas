import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
      created_at,
      loyalty_cards ( current_stamps, loyalty_programs ( visits_required ) )
    `,
    )
    .order("created_at", { ascending: false });

  const count = customers?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Clients</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {count} client{count > 1 ? "s" : ""} inscrit{count > 1 ? "s" : ""}.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
              <th className="px-4 py-3 font-medium">Passages</th>
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
                    {new Date(customer.created_at).toLocaleDateString(
                      "fr-FR",
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {card
                      ? `${card.current_stamps} / ${card.loyalty_programs?.visits_required ?? "?"}`
                      : "—"}
                  </td>
                </tr>
              );
            })}
            {count === 0 && (
              <tr>
                <td
                  colSpan={5}
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
