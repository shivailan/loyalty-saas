import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

// Empreinte non réversible : la base ne contient jamais d'adresse IP ni
// d'email en clair, seulement ce hachage.
export function fingerprint(value: string): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
    .update(value.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

export async function getClientFingerprint(): Promise<string> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  return fingerprint(ip);
}

// Renvoie true si l'action est autorisée (et enregistre la tentative), false
// si la limite est atteinte. En cas de panne du système de limitation, on
// laisse passer : mieux vaut un spam rare qu'un vrai client bloqué.
export async function allowAction(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("Rate limit check failed:", error.message);
    return true;
  }
  return data === true;
}
