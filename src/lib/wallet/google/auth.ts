import "server-only";
import { createSign } from "node:crypto";
import type { GoogleWalletConfig } from "./config";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// JWT signé RS256 avec la clé privée du compte de service.
export function signJwt(
  claims: Record<string, unknown>,
  privateKey: string,
): string {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify(claims));
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${payload}`)
    .sign(privateKey);
  return `${header}.${payload}.${base64url(signature)}`;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

// Jeton d'accès à l'API Google Wallet (valable ~1 h, gardé en mémoire).
export async function getAccessToken(
  config: GoogleWalletConfig,
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    {
      iss: config.clientEmail,
      scope: WALLET_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    },
    config.privateKey,
  );
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }
  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

// Lien « Ajouter à Google Wallet » : un JWT signé qui désigne la carte à
// ajouter (celle-ci doit déjà exister côté Google).
export function buildSaveUrl(
  config: GoogleWalletConfig,
  objectId: string,
): string {
  const jwt = signJwt(
    {
      iss: config.clientEmail,
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: [],
      payload: { loyaltyObjects: [{ id: objectId }] },
    },
    config.privateKey,
  );
  return `https://pay.google.com/gp/v/save/${jwt}`;
}
