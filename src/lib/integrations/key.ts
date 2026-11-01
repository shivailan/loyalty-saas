import "server-only";
import { createHash, randomBytes } from "node:crypto";

// Clé de liaison avec une application de commande (Qtime). Seule l'empreinte
// est stockée : la clé complète n'est montrée qu'à sa création.
const PREFIX = "kmk_";

export function generateIntegrationKey(): {
  key: string;
  hash: string;
  hint: string;
} {
  const key = PREFIX + randomBytes(24).toString("base64url");
  return { key, hash: hashIntegrationKey(key), hint: key.slice(-4) };
}

export function hashIntegrationKey(key: string): string {
  return createHash("sha256").update(key.trim()).digest("hex");
}
