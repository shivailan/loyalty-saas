import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";

export default async function AdminHomePage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { count: totalMerchants } = await supabase
    .from("merchants")
    .select("*", { count: "exact", head: true });

  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  const { count: totalVisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true });

  const { count: totalRewards } = await supabase
    .from("reward_redemptions")
    .select("*", { count: "exact", head: true });

  const stats = [
    { label: "Commerçants", value: totalMerchants ?? 0 },
    { label: "Clients (tous commerçants)", value: totalCustomers ?? 0 },
    { label: "Passages effectués", value: totalVisits ?? 0 },
    { label: "Récompenses distribuées", value: totalRewards ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Statistiques globales
      </h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-3xl font-bold text-neutral-900">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-neutral-600">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
