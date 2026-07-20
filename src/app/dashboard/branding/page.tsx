import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { LogoUploader } from "./LogoUploader";
import { ColorForm } from "./ColorForm";

export default async function BrandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, logo_url, primary_color")
    .single();
  if (!merchant) {
    redirect("/login");
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">
        Apparence de la carte
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Personnalisez le logo et la couleur affichés sur la carte de vos
        clients.
      </p>
      <Card className="mt-6 flex flex-col gap-8">
        <div>
          <h2 className="text-sm font-medium text-neutral-700">Logo</h2>
          <div className="mt-2">
            <LogoUploader
              merchantId={merchant.id}
              initialLogoUrl={merchant.logo_url}
            />
          </div>
        </div>
        <div className="border-t border-neutral-100 pt-6">
          <ColorForm defaultColor={merchant.primary_color} />
        </div>
      </Card>
    </div>
  );
}
