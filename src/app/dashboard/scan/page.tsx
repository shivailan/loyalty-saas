import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScanClient } from "./ScanClient";

export default async function ScanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">
        Scanner une carte
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Scannez le QR code affiché sur la carte du client pour ajouter un
        passage.
      </p>
      <ScanClient />
    </div>
  );
}
