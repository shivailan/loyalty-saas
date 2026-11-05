import "server-only";
import Stripe from "stripe";
import { stripeEnv } from "./env";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = stripeEnv("STRIPE_SECRET_KEY");
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    client = new Stripe(key);
  }
  return client;
}
