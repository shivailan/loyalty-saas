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
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">Scanner</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Présentez la caméra devant le QR code de la carte du client : le passage
        est ajouté tout seul.
      </p>
      <ScanClient />
    </div>
  );
}
