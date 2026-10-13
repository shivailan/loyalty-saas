import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QrCodeDisplay } from "./QrCodeDisplay";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const joinUrl = `${siteUrl}/join/${merchant.slug}`;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">Votre QR code</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Affichez ce QR code en caisse. Vos clients le scannent pour créer leur
        carte de fidélité.
      </p>
      <Card className="mt-6 border-yellow-300 bg-yellow-50">
        <h2 className="text-sm font-semibold text-neutral-900">
          Affiche prête à imprimer
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Une affiche A4 à vos couleurs, avec votre logo, votre récompense et un
          grand QR code. Imprimez-la et posez-la en caisse ou sur votre vitrine.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/dashboard/qr-code/poster"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-yellow-300"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Télécharger l&apos;affiche (PDF)
          </a>
          <a
            href="/dashboard/qr-code/poster?inline=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Voir l&apos;aperçu
          </a>
        </div>
      </Card>

      <Card className="mt-4">
        <QrCodeDisplay url={joinUrl} />
        <p className="mt-4 break-all text-center text-xs text-neutral-500">
          {joinUrl}
        </p>
      </Card>
    </div>
  );
}
