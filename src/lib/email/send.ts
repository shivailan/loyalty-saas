import "server-only";
import { getResendClient, EMAIL_FROM } from "./resend";
import {
  welcomeEmailHtml,
  rewardEmailHtml,
  retrieveCardEmailHtml,
} from "./templates";

export async function sendWelcomeEmail(params: {
  to: string;
  customerFirstName: string;
  merchantName: string;
  cardUrl: string;
}): Promise<void> {
  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Bienvenue chez ${params.merchantName}`,
      html: welcomeEmailHtml(params),
    });
  } catch (error) {
    console.error("Échec d'envoi de l'email de bienvenue :", error);
  }
}

export async function sendRetrieveCardEmail(params: {
  to: string;
  customerFirstName: string;
  merchantName: string;
  cardUrls: string[];
}): Promise<void> {
  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Votre carte de fidélité chez ${params.merchantName}`,
      html: retrieveCardEmailHtml(params),
    });
  } catch (error) {
    console.error("Échec d'envoi de l'email de récupération :", error);
  }
}

export async function sendRewardEmail(params: {
  to: string;
  customerFirstName: string;
  merchantName: string;
  rewardDescription: string;
  cardUrl: string;
}): Promise<void> {
  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: "Votre récompense est prête !",
      html: rewardEmailHtml(params),
    });
  } catch (error) {
    console.error("Échec d'envoi de l'email de récompense :", error);
  }
}
