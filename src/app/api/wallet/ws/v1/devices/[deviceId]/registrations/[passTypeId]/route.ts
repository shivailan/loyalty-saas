import { createAdminClient } from "@/lib/supabase/admin";
import { PASS_TYPE_ID } from "@/lib/wallet/config";

export const runtime = "nodejs";

// Après une notification, l'iPhone demande « quelles cartes ont changé depuis
// ma dernière visite ? ». Le paramètre passesUpdatedSince est la valeur
// lastUpdated que nous lui avons renvoyée la fois précédente.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ deviceId: string; passTypeId: string }> },
) {
  const { deviceId, passTypeId } = await params;
  if (passTypeId !== PASS_TYPE_ID) {
    return new Response("Not found", { status: 404 });
  }
  const since = new URL(request.url).searchParams.get("passesUpdatedSince");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("wallet_registrations")
    .select("card_id, loyalty_cards ( updated_at )")
    .eq("device_library_identifier", deviceId)
    .eq("pass_type_identifier", passTypeId);
  if (error) {
    console.error("Wallet registrations lookup failed:", error.message);
    return new Response("Server error", { status: 500 });
  }

  // L'étiquette lastUpdated est un nombre (millisecondes) : un horodatage ISO
  // contient un « + » qui, dans une URL, serait relu comme un espace.
  const sinceMs = since ? Number(since) : 0;
  const changed = (data ?? [])
    .map((row) => ({
      serial: row.card_id,
      updatedMs: row.loyalty_cards?.updated_at
        ? new Date(row.loyalty_cards.updated_at).getTime()
        : 0,
    }))
    .filter((row) => row.updatedMs > sinceMs);

  if (changed.length === 0) {
    return new Response(null, { status: 204 });
  }

  const lastUpdated = String(Math.max(...changed.map((row) => row.updatedMs)));
  return Response.json({
    serialNumbers: changed.map((row) => row.serial),
    lastUpdated,
  });
}
