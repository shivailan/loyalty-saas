import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isBillingEnabled, trialDays } from "@/lib/billing/config";
import { isStripeTestMode } from "@/lib/billing/env";
import { hasPaidAccess } from "@/lib/billing/access";
import { plans } from "@/lib/plans";
import {
  choiceInfo,
  choiceParts,
  choicesForOffer,
  parseOffer,
  parseTier,
} from "@/lib/offers";
import { startCheckout } from "./actions";
import { SubscribeButton } from "./SubscribeButton";
import { CheckoutShell } from "./CheckoutShell";
import { logout } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Choisir ma formule — KeepMe",
  robots: { index: false, follow: false },
};

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; niveaux?: string }>;
}) {
  const { error, niveaux } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select(
      "name, offer, billing_exempt, subscription_status, stripe_subscription_id",
    )
    .eq("owner_id", user.id)
    .single();
  // Sans fiche commerce, l'espace explique la situation (pas de renvoi à la connexion).
  if (!merchant) redirect("/dashboard");
  if (!isBillingEnabled() || hasPaidAccess(merchant)) redirect("/dashboard");

  // Même règle que lors du paiement : pas de second essai gratuit.
  const days = merchant.stripe_subscription_id ? 0 : trialDays();
  const offer = parseOffer(merchant.offer);
  const wasSubscribed = ["canceled", "unpaid", "incomplete_expired"].includes(
    merchant.subscription_status,
  );
  // Niveau déjà choisi sur l'accueil : on ne propose que lui, avec un lien
  // pour voir l'autre. Sans niveau connu (ou pour reprendre un abonnement),
  // on propose les deux.
  const chosenTier = parseTier(user.user_metadata?.tier);
  const showAll = niveaux === "tous" || wasSubscribed || !chosenTier;
  const sellable = choicesForOffer(offer)
    .filter((choice) => showAll || choiceParts(choice).tier === chosenTier)
    .map((choice) => ({ choice, ...choiceInfo(choice) }));
  // L'offre Premium n'est annoncée que pour la fidélité, et seulement quand
  // on montre tous les niveaux.
  const upcoming =
    offer === "commande" || !showAll
      ? undefined
      : plans.find((plan) => plan.comingSoon);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              K
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              KeepMe
            </span>
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
            >
              Se déconnecter
            </button>
          </form>
        </div>

        {isStripeTestMode() && (
          <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <strong>Mode test Stripe :</strong> aucun paiement réel. Utilisez la
            carte 4242 4242 4242 4242, une date future et un CVC quelconque.
          </p>
        )}

        <h1 className="mt-10 text-2xl font-bold text-neutral-900">
          {wasSubscribed
            ? "Reprenez votre abonnement"
            : `Bienvenue ${merchant.name.trim()} !`}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {wasSubscribed
            ? "Votre abonnement est terminé. Choisissez une formule pour retrouver l'accès à votre espace."
            : "Dernière étape : choisissez votre formule pour accéder à votre espace commerçant."}
          {days > 0 && ` Les ${days} premiers jours sont offerts.`} Sans
          engagement, résiliable à tout moment.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Le paiement n&apos;a pas pu être lancé. Réessayez dans un instant,
            ou contactez-nous si le problème continue.
          </p>
        )}

        <CheckoutShell key={error ?? "ok"}>
          <div
            className={`mt-10 grid items-stretch gap-4 ${sellable.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-md"}`}
          >
            {sellable.map((plan) => (
              <div
                key={plan.choice}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-yellow-400 bg-neutral-900 text-white shadow-xl ring-2 ring-yellow-400 sm:-my-2 sm:py-8"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-900">
                    Le plus choisi
                  </span>
                )}
                <h2
                  className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-neutral-900"}`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`mt-1 text-sm ${plan.highlighted ? "text-neutral-300" : "text-neutral-600"}`}
                >
                  {plan.description}
                </p>
                <p
                  className={`mt-4 text-3xl font-bold ${plan.highlighted ? "text-yellow-400" : "text-neutral-900"}`}
                >
                  {plan.price} €
                  <span
                    className={`text-sm font-medium ${plan.highlighted ? "text-neutral-300" : "text-neutral-500"}`}
                  >
                    {" "}
                    / mois
                  </span>
                </p>
                <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex gap-2 ${
                        plan.highlighted ? "text-neutral-100" : "text-neutral-700"
                      }`}
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-yellow-400" : "text-yellow-600"}`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <form
                  action={startCheckout.bind(null, plan.choice)}
                  className="mt-6"
                >
                  <SubscribeButton
                    highlighted={Boolean(plan.highlighted)}
                    label={
                      days > 0
                        ? `Essayer ${days} jours gratuitement`
                        : "S'abonner"
                    }
                  />
                </form>
              </div>
            ))}
          </div>

          {!showAll && (
            <p className="mt-4 text-center text-sm text-neutral-600">
              <Link
                href="/subscribe?niveaux=tous"
                className="font-medium underline hover:text-neutral-900"
              >
                Changer de niveau
              </Link>
            </p>
          )}

          {upcoming && (
            <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {upcoming.name}
                </h2>
                <span className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
                  À venir
                </span>
                <span className="text-sm text-neutral-500">
                  Tarif communiqué prochainement
                </span>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
                {upcoming.features.slice(1).map((feature) => (
                  <li key={feature.label} className="flex gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
                      aria-hidden="true"
                    />
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CheckoutShell>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Paiement sécurisé par Stripe. TVA non applicable, art. 293 B du CGI.
          En vous abonnant, vous acceptez nos{" "}
          <Link href="/cgv" className="underline">
            conditions de vente
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
