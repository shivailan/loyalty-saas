import "server-only";
import type { GoogleWalletConfig } from "./config";
import { getAccessToken } from "./auth";

const BASE = "https://walletobjects.googleapis.com/walletobjects/v1";

export type GoogleResult = { status: number; body: string };

async function call(
  config: GoogleWalletConfig,
  method: "POST" | "PATCH",
  path: string,
  payload: unknown,
): Promise<GoogleResult> {
  const token = await getAccessToken(config);
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });
  return { status: response.status, body: await response.text() };
}

// Crée la ressource, ou la met à jour si elle existe déjà (409).
async function upsert(
  config: GoogleWalletConfig,
  resource: "loyaltyClass" | "loyaltyObject",
  id: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const created = await call(config, "POST", `/${resource}`, payload);
  if (created.status === 200) return;
  if (created.status === 409) {
    const patched = await call(
      config,
      "PATCH",
      `/${resource}/${encodeURIComponent(id)}`,
      payload,
    );
    if (patched.status === 200) return;
    throw new Error(`Google ${resource} update ${patched.status}: ${patched.body.slice(0, 300)}`);
  }
  throw new Error(`Google ${resource} insert ${created.status}: ${created.body.slice(0, 300)}`);
}

export function upsertLoyaltyClass(
  config: GoogleWalletConfig,
  payload: Record<string, unknown> & { id: string },
) {
  return upsert(config, "loyaltyClass", payload.id, payload);
}

export function upsertLoyaltyObject(
  config: GoogleWalletConfig,
  payload: Record<string, unknown> & { id: string },
) {
  return upsert(config, "loyaltyObject", payload.id, payload);
}

// Met à jour une carte déjà ajoutée. 404 = le client n'a finalement pas
// terminé l'ajout : ce n'est pas une erreur.
export async function patchLoyaltyObject(
  config: GoogleWalletConfig,
  objectId: string,
  payload: Record<string, unknown>,
): Promise<number> {
  const result = await call(
    config,
    "PATCH",
    `/loyaltyObject/${encodeURIComponent(objectId)}`,
    payload,
  );
  if (result.status !== 200 && result.status !== 404) {
    console.error("Google object patch failed:", result.status, result.body.slice(0, 300));
  }
  return result.status;
}

// Ajoute un message à la carte. TEXT_AND_NOTIFY l'affiche aussi en
// notification sur le téléphone du client.
export async function addLoyaltyMessage(
  config: GoogleWalletConfig,
  objectId: string,
  message: { id: string; header: string; body: string },
): Promise<number> {
  const result = await call(
    config,
    "POST",
    `/loyaltyObject/${encodeURIComponent(objectId)}/addMessage`,
    { message: { ...message, messageType: "TEXT_AND_NOTIFY" } },
  );
  if (result.status !== 200 && result.status !== 404) {
    console.error("Google addMessage failed:", result.status, result.body.slice(0, 300));
  }
  return result.status;
}
