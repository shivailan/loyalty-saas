import { parseOffer, parseTier } from "@/lib/offers";
import SignupForm from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ offre?: string | string[]; niveau?: string | string[] }>;
}) {
  const { offre, niveau } = await searchParams;
  const offer = parseOffer(offre);
  // Le niveau n'a de sens que pour les offres qui en ont (pas Commande).
  const tier = offer === "commande" ? null : parseTier(niveau);
  return <SignupForm offer={offer} tier={tier} />;
}
