import "server-only";
import { PKPass } from "passkit-generator";
import { legal } from "@/lib/legal";
import { PASS_TYPE_ID, APPLE_TEAM_ID, type WalletCertificates } from "./config";
import { passColors } from "./colors";
import { buildIcons, buildLogo } from "./images";
import { walletAuthToken } from "./auth";

export type WalletCardData = {
  cardId: string;
  stamps: number;
  required: number;
  rewardDescription: string | null;
  firstName: string | null;
  merchantName: string;
  merchantColor: string | null;
  merchantLogoUrl: string | null;
  siteUrl: string;
};

export async function buildApplePass(
  data: WalletCardData,
  certificates: WalletCertificates,
): Promise<Buffer> {
  const [icons, logo] = await Promise.all([
    buildIcons(),
    buildLogo(data.merchantLogoUrl),
  ]);

  const pass = new PKPass({ ...icons, ...logo }, certificates, {
    formatVersion: 1,
    passTypeIdentifier: PASS_TYPE_ID,
    teamIdentifier: APPLE_TEAM_ID,
    serialNumber: data.cardId,
    organizationName: data.merchantName,
    description: `Carte de fidélité ${data.merchantName}`,
    logoText: data.merchantName,
    ...passColors(data.merchantColor),
    // Apple n'accepte le service de mise à jour qu'en HTTPS : en local
    // (http://localhost) la carte est créée sans mise à jour automatique.
    ...(data.siteUrl.startsWith("https://")
      ? {
          webServiceURL: `${data.siteUrl}/api/wallet/ws`,
          authenticationToken: walletAuthToken(data.cardId),
        }
      : {}),
  });

  pass.type = "storeCard";

  // Apple impose la taille du champ principal : pas de label dessous (il
  // chevauchait le gros chiffre), l'unité est rappelée en haut à droite.
  pass.headerFields.push({
    key: "unit",
    label: "",
    value: "Passages",
  });
  pass.primaryFields.push({
    key: "stamps",
    label: "",
    value: `${data.stamps} sur ${data.required}`,
    changeMessage: "Passages : %@",
  });

  if (data.rewardDescription) {
    pass.secondaryFields.push({
      key: "reward",
      label: "RÉCOMPENSE",
      value: data.rewardDescription,
    });
  }
  if (data.firstName) {
    pass.auxiliaryFields.push({
      key: "holder",
      label: "TITULAIRE",
      value: data.firstName,
    });
  }

  pass.backFields.push(
    {
      key: "howto",
      label: "Comment ça marche",
      value:
        "Présentez le QR code au commerçant à chaque passage. Une fois le nombre de passages atteint, votre récompense vous est remise.",
    },
    {
      key: "link",
      label: "Ma carte en ligne",
      value: `${data.siteUrl}/card/${data.cardId}`,
    },
    {
      key: "contact",
      label: "Contact",
      value: legal.contactEmail,
    },
  );

  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: data.cardId,
    messageEncoding: "iso-8859-1",
  });

  return pass.getAsBuffer();
}
