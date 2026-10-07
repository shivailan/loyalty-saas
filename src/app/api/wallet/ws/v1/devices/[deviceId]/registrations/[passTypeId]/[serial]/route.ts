import { createAdminClient } from "@/lib/supabase/admin";
import { isWalletRequestAuthorized } from "@/lib/wallet/auth";
import { PASS_TYPE_ID } from "@/lib/wallet/config";
import { UUID_PATTERN } from "@/lib/wallet/load-card";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ deviceId: string; passTypeId: string; serial: string }>;
};

// Apple appelle cette route quand un client ajoute la carte à son Wallet :
// on retient quel appareil la possède et son jeton de notification.
export async function POST(request: Request, { params }: Context) {
  const { deviceId, passTypeId, serial } = await params;
  if (passTypeId !== PASS_TYPE_ID || !UUID_PATTERN.test(serial)) {
    return new Response("Not found", { status: 404 });
  }
  if (!isWalletRequestAuthorized(request, serial)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    pushToken?: unknown;
  } | null;
  if (typeof body?.pushToken !== "string" || body.pushToken.length === 0) {
    return new Response("Bad request", { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("wallet_registrations")
    .select("card_id")
    .eq("device_library_identifier", deviceId)
    .eq("pass_type_identifier", passTypeId)
    .eq("card_id", serial)
    .maybeSingle();

  const { error } = await supabase.from("wallet_registrations").upsert({
    device_library_identifier: deviceId,
    pass_type_identifier: passTypeId,
    card_id: serial,
    push_token: body.pushToken,
  });
  if (error) {
    console.error("Wallet registration failed:", error.message);
    return new Response("Server error", { status: 500 });
  }
  return new Response(null, { status: existing ? 200 : 201 });
}

// Apple appelle cette route quand le client retire la carte de son Wallet.
export async function DELETE(request: Request, { params }: Context) {
  const { deviceId, passTypeId, serial } = await params;
  if (passTypeId !== PASS_TYPE_ID || !UUID_PATTERN.test(serial)) {
    return new Response("Not found", { status: 404 });
  }
  if (!isWalletRequestAuthorized(request, serial)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("wallet_registrations")
    .delete()
    .eq("device_library_identifier", deviceId)
    .eq("pass_type_identifier", passTypeId)
    .eq("card_id", serial);
  if (error) {
    console.error("Wallet unregistration failed:", error.message);
    return new Response("Server error", { status: 500 });
  }
  return new Response(null, { status: 200 });
}
