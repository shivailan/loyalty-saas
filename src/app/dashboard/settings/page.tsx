import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { BusinessNameForm } from "./BusinessNameForm";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function SettingsPage() {
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
  if (!merchant) {
    redirect("/login");
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">
        Paramètres du compte
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Connecté en tant que {user.email}
      </p>

      <Card className="mt-6">
        <h2 className="text-sm font-medium text-neutral-700">
          Nom de l&apos;établissement
        </h2>
        <div className="mt-3">
          <BusinessNameForm defaultValue={merchant.name} />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-medium text-neutral-700">
          Mot de passe
        </h2>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </Card>
    </div>
  );
}
