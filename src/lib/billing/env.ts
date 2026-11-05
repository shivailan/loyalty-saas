import "server-only";

// Mode test de Stripe : avec STRIPE_USE_TEST=true, les variables Stripe sont
// lues avec le suffixe _TEST (STRIPE_SECRET_KEY_TEST, STRIPE_PRICE_COMMANDE_TEST…).
// Les vraies clés restent en place, intactes : pour revenir aux vrais paiements,
// il suffit de retirer (ou mettre à false) STRIPE_USE_TEST.
export function isStripeTestMode(): boolean {
  return process.env.STRIPE_USE_TEST === "true";
}

export function stripeEnv(name: string): string | undefined {
  const value = isStripeTestMode() ? process.env[`${name}_TEST`] : process.env[name];
  return value || undefined;
}
