import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isoDateDaysAgo } from "@/lib/dates";
import { Card } from "@/components/ui/Card";

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id")
    .single();
  if (!merchant) {
    redirect("/login");
  }

  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("merchant_id", merchant.id);

  const { count: totalVisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true });

  const { count: totalRewards } = await supabase
    .from("reward_redemptions")
    .select("*", { count: "exact", head: true });

  const thirtyDaysAgo = isoDateDaysAgo(30);

  const { data: recentVisits } = await supabase
    .from("visits")
    .select("loyalty_cards ( customer_id )")
    .gte("created_at", thirtyDaysAgo);

  const activeCustomers = new Set(
    (recentVisits ?? [])
      .map((visit) => visit.loyalty_cards?.customer_id)
      .filter((id): id is string => Boolean(id)),
  ).size;

  const stats = [
    { label: "Inscriptions", value: totalCustomers ?? 0 },
    { label: "Passages effectués", value: totalVisits ?? 0 },
    { label: "Récompenses distribuées", value: totalRewards ?? 0 },
    { label: "Clients actifs (30 jours)", value: activeCustomers },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Statistiques</h1>
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
