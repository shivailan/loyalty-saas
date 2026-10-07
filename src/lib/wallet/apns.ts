import "server-only";
import http2 from "node:http2";
import { PASS_TYPE_ID, type WalletCertificates } from "./config";

export type PushResult = { token: string; status: number };

// Envoie à Apple un « réveil » vide pour chaque iPhone concerné : Wallet
// redemande alors lui-même la dernière version de la carte. Apple authentifie
// l'expéditeur grâce au certificat de la carte (le même que celui qui signe).
export async function sendWalletPushes(
  tokens: string[],
  certificates: WalletCertificates,
): Promise<PushResult[]> {
  if (tokens.length === 0) return [];

  const client = http2.connect("https://api.push.apple.com", {
    cert: Buffer.concat([
      certificates.signerCert,
      Buffer.from("\n"),
      certificates.wwdr,
    ]),
    key: certificates.signerKey,
    passphrase: certificates.signerKeyPassphrase,
  });
  client.on("error", (error) => console.error("APNs connection error:", error));

  try {
    return await Promise.all(
      tokens.map(
        (token) =>
          new Promise<PushResult>((resolve) => {
            const request = client.request({
              ":method": "POST",
              ":path": `/3/device/${token}`,
              "apns-topic": PASS_TYPE_ID,
            });
            let status = 0;
            let body = "";
            const timer = setTimeout(() => {
              request.close();
              resolve({ token, status: 0 });
            }, 8000);
            request.on("response", (headers) => {
              status = Number(headers[":status"] ?? 0);
            });
            request.setEncoding("utf8");
            request.on("data", (chunk) => (body += chunk));
            request.on("end", () => {
              clearTimeout(timer);
              if (status !== 200) {
                console.error("APNs push refused:", status, body.slice(0, 200));
              }
              resolve({ token, status });
            });
            request.on("error", (error) => {
              clearTimeout(timer);
              console.error("APNs request error:", error);
              resolve({ token, status: 0 });
            });
            request.end("{}");
          }),
      ),
    );
  } finally {
    client.close();
  }
}
