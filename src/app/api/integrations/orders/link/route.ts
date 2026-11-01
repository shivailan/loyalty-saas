import { createAdminClient } from "@/lib/supabase/admin";
import { generateIntegrationKey } from "@/lib/integrations/key";
import { isTrustedCaller, verifyHandoffToken } from "@/lib/integrations/handoff";
import { allowAction, getClientFingerprint } from "@/lib/rate-limit";

export const runtime = "nodejs";

// L'application de commande appelle cette adresse juste après avoir créé la
// page de commande d'un restaurateur venu de KeepMe : on génère la clé de
// liaison et on la lui renvoie, sans copier-coller. Deux preuves sont exigées :
// le secret partagé (appel serveur à serveur) et le lien signé du restaurateur.
export async function POST(request: Request) {
  if (!isTrustedCaller(request.headers.get("authorization"))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const allowed = await allowAction(
    `orderlink-handoff:${await getClientFingerprint()}`,
    30,
    3600,
  );
  if (!allowed) return Response.json({ error: "rate_limited" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as { token?: string } | null;
  const payload = body?.token ? verifyHandoffToken(body.token) : null;
  if (!payload) return Response.json({ error: "invalid_token" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, offer")
    .eq("id", payload.m)
    .maybeSingle();
  if (!merchant || merchant.offer === "fidelite") {
    return Response.json({ error: "not_eligible" }, { status: 403 });
  }

  const { key, hash, hint } = generateIntegrationKey();
  const { error } = await supabase
    .from("merchants")
    .update({
      integration_key_hash: hash,
      integration_key_hint: hint,
      integration_key_created_at: new Date().toISOString(),
    })
    .eq("id", merchant.id);
  if (error) {
    console.error("Order link: key storage failed", error.message);
    return Response.json({ error: "server_error" }, { status: 500 });
  }

  return Response.json({ key });
}
