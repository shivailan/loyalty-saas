import "server-only";

export type GoogleWalletConfig = {
  issuerId: string;
  clientEmail: string;
  privateKey: string;
};

// Renvoie null tant que Google Wallet n'est pas configuré : le bouton
// « Ajouter à Google Wallet » reste alors caché, rien ne casse.
//
// GOOGLE_WALLET_SERVICE_ACCOUNT_BASE64 = le fichier de clé JSON du compte de
// service Google, encodé en base64.
export function getGoogleWalletConfig(): GoogleWalletConfig | null {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const encoded = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_BASE64;
  if (!issuerId || !encoded) return null;
  try {
    const key = JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as {
      client_email?: string;
      private_key?: string;
    };
    if (!key.client_email || !key.private_key) return null;
    return {
      issuerId,
      clientEmail: key.client_email,
      privateKey: key.private_key,
    };
  } catch {
    return null;
  }
}

export function isGoogleWalletConfigured(): boolean {
  return getGoogleWalletConfig() !== null;
}

// Identifiants Google : « <émetteur>.<identifiant choisi par nous> ».
export function googleClassId(config: GoogleWalletConfig, merchantId: string) {
  return `${config.issuerId}.keepme-${merchantId}`;
}

export function googleObjectId(config: GoogleWalletConfig, cardId: string) {
  return `${config.issuerId}.card-${cardId}`;
}
