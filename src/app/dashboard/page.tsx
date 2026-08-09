import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { navGroups } from "./nav-items";
import { iconMap } from "@/lib/icons";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("name")
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Bienvenue{merchant ? `, ${merchant.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Connecté en tant que {user.email}
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {navGroups.map((group) => {
          const items = group.items.filter((item) => item.href !== "/dashboard");
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {group.label}
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <Link key={item.href} href={item.href}>
                      <Card className="h-full transition hover:border-yellow-300 hover:shadow-md">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                          <Icon className="h-5 w-5 text-yellow-700" />
                        </div>
                        <h3 className="mt-4 font-semibold text-neutral-900">
                          {item.label}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {item.description}
                        </p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
