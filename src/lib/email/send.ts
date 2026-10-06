import "server-only";
import { legal } from "@/lib/legal";
import { getResendClient, EMAIL_FROM } from "./resend";
import {
  welcomeEmailHtml,
  rewardEmailHtml,
  retrieveCardEmailHtml,
} from "./templates";

// Un échec d'envoi ne doit jamais bloquer l'action du client ou du commerçant :
// on l'enregistre dans les logs et on continue. Resend ne lève pas d'exception
// quand l'envoi est refusé (domaine non vérifié, adresse invalide...), il
// renvoie une erreur dans sa réponse, qu'il faut donc lire explicitement.
async function deliver(
  label: string,
  message: { to: string; subject: string; html: string },
): Promise<void> {
  try {
    const { error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      replyTo: legal.contactEmail,
      ...message,
    });
    if (error) {
      console.error(`Échec d'envoi de l'email (${label}) :`, error);
    }
  } catch (error) {
    console.error(`Échec d'envoi de l'email (${label}) :`, error);
  }
}

export async function sendWelcomeEmail(params: {
  to: string;
  customerFirstName: string;
  merchantName: string;
  cardUrl: string;
}): Promise<void> {
  await deliver("bienvenue", {
    to: params.to,
    subject: `Bienvenue chez ${params.merchantName}`,
    html: welcomeEmailHtml(params),
  });
}

export async function sendRetrieveCardEmail(params: {
  to: string;
  customerFirstName: string;
  merchantName: string;
  cardUrls: string[];
}): Promise<void> {
  await deliver("récupération de carte", {
    to: params.to,
    subject: `Votre carte de fidélité chez ${params.merchantName}`,
    html: retrieveCardEmailHtml(params),
  });
}

export async function sendRewardEmail(params: {
  to: string;
  customerFirstName: string;
  merchantName: string;
  rewardDescription: string;
  cardUrl: string;
}): Promise<void> {
  await deliver("récompense", {
    to: params.to,
    subject: "Votre récompense est prête !",
    html: rewardEmailHtml(params),
  });
}
