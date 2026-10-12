// Les noms (commerce, client) et la récompense sont saisis par des
// utilisateurs : on neutralise le HTML avant de les insérer dans un email.
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailLayout(bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, sans-serif; background: #f9fafb; padding: 32px;">
      <div style="max-width: 420px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <span style="display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; background: #facc15; border-radius: 8px; font-weight: 700; color: #171717;">K</span>
          <span style="font-weight: 600; color: #171717; font-size: 16px;">KeepMe</span>
        </div>
        ${bodyHtml}
      </div>
    </div>
  `;
}

function ctaButton(url: string, label: string): string {
  return `<a href="${url}" style="display: inline-block; margin-top: 20px; background: #facc15; color: #171717; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 8px; text-decoration: none;">${label}</a>`;
}

export function welcomeEmailHtml(params: {
  customerFirstName: string;
  merchantName: string;
  cardUrl: string;
}): string {
  return emailLayout(`
    <h1 style="font-size: 20px; color: #171717; margin: 0 0 12px;">Bienvenue chez ${esc(params.merchantName)} !</h1>
    <p style="font-size: 14px; color: #525252; line-height: 1.6; margin: 0;">
      Bonjour ${esc(params.customerFirstName)}, votre carte de fidélité a bien été créée.
      Gardez ce lien pour la retrouver à tout moment.
    </p>
    ${ctaButton(params.cardUrl, "Voir ma carte")}
  `);
}

export function retrieveCardEmailHtml(params: {
  customerFirstName: string;
  merchantName: string;
  cardUrls: string[];
}): string {
  const buttons = params.cardUrls
    .map((url) => ctaButton(url, "Voir ma carte"))
    .join("<br />");
  return emailLayout(`
    <h1 style="font-size: 20px; color: #171717; margin: 0 0 12px;">Voici votre carte</h1>
    <p style="font-size: 14px; color: #525252; line-height: 1.6; margin: 0;">
      Bonjour ${esc(params.customerFirstName)}, voici le lien vers votre carte de fidélité chez ${esc(params.merchantName)}.
    </p>
    ${buttons}
  `);
}

export function rewardEmailHtml(params: {
  customerFirstName: string;
  merchantName: string;
  rewardDescription: string;
  cardUrl: string;
}): string {
  return emailLayout(`
    <h1 style="font-size: 20px; color: #171717; margin: 0 0 12px;">Votre récompense est prête !</h1>
    <p style="font-size: 14px; color: #525252; line-height: 1.6; margin: 0;">
      Bonjour ${esc(params.customerFirstName)}, vous avez atteint le seuil chez ${esc(params.merchantName)}.
      Passez récupérer : <strong style="color: #171717;">${esc(params.rewardDescription)}</strong>.
    </p>
    ${ctaButton(params.cardUrl, "Voir ma carte")}
  `);
}

export function trialEndingEmailHtml(params: {
  merchantName: string;
  planName: string;
  price: string;
  trialEndDate: string;
  billingUrl: string;
}): string {
  return emailLayout(`
    <h1 style="font-size: 20px; color: #171717; margin: 0 0 12px;">Votre essai gratuit se termine bientôt</h1>
    <p style="font-size: 14px; color: #525252; line-height: 1.6; margin: 0;">
      Bonjour, l'essai gratuit de ${esc(params.merchantName)} sur KeepMe se termine le
      <strong style="color: #171717;">${esc(params.trialEndDate)}</strong>.
    </p>
    <p style="font-size: 14px; color: #525252; line-height: 1.6; margin: 12px 0 0;">
      Sans action de votre part, votre abonnement
      <strong style="color: #171717;">${esc(params.planName)}</strong>
      (${esc(params.price)} € par mois) démarrera automatiquement et le premier
      paiement sera prélevé à cette date. Vous pouvez changer de formule ou
      résilier sans frais avant cette date.
    </p>
    ${ctaButton(params.billingUrl, "Gérer mon abonnement")}
    <p style="font-size: 12px; color: #a3a3a3; line-height: 1.6; margin: 24px 0 0;">
      Une question ? Répondez simplement à cet email.
    </p>
  `);
}
