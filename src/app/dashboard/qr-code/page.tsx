import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QrCodeDisplay } from "./QrCodeDisplay";
import { Card } from "@/components/ui/Card";

export default async function QrCodePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("name, slug")
    .single();
  if (!merchant) {
    redirect("/login");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const joinUrl = `${siteUrl}/join/${merchant.slug}`;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">Votre QR code</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Affichez ce QR code en caisse. Vos clients le scannent pour créer leur
        carte de fidélité.
      </p>
      <Card className="mt-6">
        <QrCodeDisplay url={joinUrl} />
        <p className="mt-4 break-all text-center text-xs text-neutral-500">
          {joinUrl}
        </p>
      </Card>
    </div>
  );
}
