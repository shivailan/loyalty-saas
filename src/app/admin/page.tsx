import { Store, Users, ScanLine, Gift } from "lucide-react";
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
    {
      label: "Commerçants",
      value: totalMerchants ?? 0,
      icon: Store,
      tint: "bg-blue-50 text-blue-600",
    },
    {
      label: "Clients (tous commerçants)",
      value: totalCustomers ?? 0,
      icon: Users,
      tint: "bg-purple-50 text-purple-600",
    },
    {
      label: "Passages effectués",
      value: totalVisits ?? 0,
      icon: ScanLine,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Récompenses distribuées",
      value: totalRewards ?? 0,
      icon: Gift,
      tint: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-neutral-900">
        Vue d&apos;ensemble
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Statistiques globales de la plateforme, tous commerçants confondus.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tint}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-bold text-neutral-900">
                {stat.value.toLocaleString("fr-FR")}
              </p>
              <p className="mt-1 text-sm text-neutral-600">{stat.label}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
