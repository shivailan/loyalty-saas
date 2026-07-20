import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgramForm } from "./ProgramForm";
import { Card } from "@/components/ui/Card";

export default async function ProgramPage() {
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

  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("name, visits_required, reward_description, is_active")
    .eq("merchant_id", merchant.id)
    .maybeSingle();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">
        Règles de fidélité
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Définissez le nombre de passages nécessaires et la récompense offerte
        à vos clients.
      </p>
      <Card className="mt-6">
        <ProgramForm
          defaultValues={{
            name: program?.name ?? "Carte de fidélité",
            visitsRequired: program?.visits_required ?? 10,
            rewardDescription: program?.reward_description ?? "",
            isActive: program?.is_active ?? true,
          }}
        />
      </Card>
    </div>
  );
}
