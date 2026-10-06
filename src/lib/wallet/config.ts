import "server-only";

export const PASS_TYPE_ID = "pass.fr.keepmecard.card";
export const APPLE_TEAM_ID = "QL6YB7MA58";

export type WalletCertificates = {
  wwdr: Buffer;
  signerCert: Buffer;
  signerKey: Buffer;
  signerKeyPassphrase?: string;
};

function fromBase64(name: string): Buffer | null {
  const value = process.env[name];
  return value ? Buffer.from(value, "base64") : null;
}

// Renvoie null tant que les certificats Apple ne sont pas configurés : le
// bouton « Ajouter à Apple Wallet » reste alors caché, rien ne casse.
export function getWalletCertificates(): WalletCertificates | null {
  const wwdr = fromBase64("APPLE_WWDR_CERT_BASE64");
  const signerCert = fromBase64("APPLE_PASS_SIGNER_CERT_BASE64");
  const signerKey = fromBase64("APPLE_PASS_SIGNER_KEY_BASE64");
  if (!wwdr || !signerCert || !signerKey) return null;
  return {
    wwdr,
    signerCert,
    signerKey,
    signerKeyPassphrase: process.env.APPLE_PASS_SIGNER_KEY_PASSPHRASE,
  };
}

export function isAppleWalletConfigured(): boolean {
  return getWalletCertificates() !== null;
}
