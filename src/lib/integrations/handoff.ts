import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Lien signé entre KeepMe et l'application de commande (même secret des deux
// côtés, HANDOFF_SECRET). Il porte l'identité du commerçant, expire vite, et
// ne peut pas être fabriqué sans le secret.
const TTL_SECONDS = 60 * 60;

export type HandoffPayload = { m: string; e: string; exp: number };

function secret(): string | null {
  const value = process.env.HANDOFF_SECRET;
  return value && value.length >= 32 ? value : null;
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

export function createHandoffToken(merchantId: string, email: string): string | null {
  const key = secret();
  if (!key) return null;
  const payload: HandoffPayload = {
    m: merchantId,
    e: email,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

export function verifyHandoffToken(token: string): HandoffPayload | null {
  const key = secret();
  if (!key) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body, key));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as HandoffPayload;
    if (!payload.m || !payload.e || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// L'application de commande prouve qu'elle est bien KeepMe-Commande en
// présentant le même secret.
export function isTrustedCaller(authorization: string | null): boolean {
  const key = secret();
  if (!key || !authorization) return false;
  const given = Buffer.from(authorization.replace(/^Bearer\s+/i, ""));
  const wanted = Buffer.from(key);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}
