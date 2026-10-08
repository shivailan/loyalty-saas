import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isBillingEnabled, trialDays } from "@/lib/billing/config";
import { hasPaidAccess } from "@/lib/billing/access";
import { plans } from "@/lib/plans";
import { startCheckout } from "./actions";
import { logout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("name, billing_exempt, subscription_status")
    .eq("owner_id", user.id)
    .single();
  if (!merchant) redirect("/login");
  if (!isBillingEnabled() || hasPaidAccess(merchant)) redirect("/dashboard");

  const days = trialDays();
  const sellable = plans.filter((plan) => plan.id);
  const wasSubscribed = ["canceled", "unpaid", "incomplete_expired"].includes(
    merchant.subscription_status,
  );

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

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sellable.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${plan.highlighted ? "border-yellow-400 ring-2 ring-yellow-400/30" : "border-neutral-200"}`}
            >
              <h2 className="text-lg font-semibold text-neutral-900">
                {plan.name}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {plan.description}
              </p>
              <p className="mt-4 text-3xl font-bold text-neutral-900">
                {plan.price} €
                <span className="text-sm font-medium text-neutral-500">
                  {" "}
                  / mois
                </span>
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-neutral-700">
                {plan.features
                  .filter((feature) => !feature.soon)
                  .map((feature) => (
                    <li key={feature.label} className="flex gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600"
                        aria-hidden="true"
                      />
                      {feature.label}
                    </li>
                  ))}
              </ul>
              <form action={startCheckout.bind(null, plan.id!)} className="mt-6">
                <Button type="submit" className="w-full">
                  {days > 0 ? `Essayer ${days} jours gratuitement` : "S'abonner"}
                </Button>
              </form>
            </div>
          ))}
        </div>

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
