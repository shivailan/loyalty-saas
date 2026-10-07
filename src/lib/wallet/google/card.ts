import "server-only";
import type { WalletCardData } from "../apple-pass";
import { hexBackground } from "../colors";
import {
  googleClassId,
  googleObjectId,
  type GoogleWalletConfig,
} from "./config";

function localized(value: string) {
  return { defaultValue: { language: "fr", value } };
}

// « Modèle » de carte, commun à tous les clients d'un commerçant.
export function buildLoyaltyClass(
  config: GoogleWalletConfig,
  data: WalletCardData,
) {
  return {
    id: googleClassId(config, data.merchantId),
    issuerName: data.merchantName,
    programName: data.merchantName,
    programLogo: {
      sourceUri: {
        uri: `${data.siteUrl}/api/wallet/google/logo/${data.merchantId}`,
      },
      contentDescription: localized(data.merchantName),
    },
    hexBackgroundColor: hexBackground(data.merchantColor),
    accountNameLabel: "Titulaire",
    reviewStatus: "UNDER_REVIEW",
  };
}

// Champs qui changent à chaque passage : envoyés à la création puis à chaque
// mise à jour.
export function buildObjectState(data: WalletCardData) {
  return {
    loyaltyPoints: {
      label: "Passages",
      balance: { string: `${data.stamps} sur ${data.required}` },
    },
    textModulesData: data.rewardDescription
      ? [{ id: "reward", header: "Récompense", body: data.rewardDescription }]
      : [],
  };
}

// La carte d'un client. Le QR code contient l'identifiant de la carte, comme
// sur la page web et sur Apple Wallet : le commerçant scanne de la même façon.
export function buildLoyaltyObject(
  config: GoogleWalletConfig,
  data: WalletCardData,
) {
  return {
    id: googleObjectId(config, data.cardId),
    classId: googleClassId(config, data.merchantId),
    state: "ACTIVE",
    accountId: data.cardId,
    ...(data.firstName ? { accountName: data.firstName } : {}),
    barcode: { type: "QR_CODE", value: data.cardId },
    linksModuleData: {
      uris: [
        {
          id: "card",
          description: "Ma carte en ligne",
          uri: `${data.siteUrl}/card/${data.cardId}`,
        },
      ],
    },
    ...buildObjectState(data),
  };
}
