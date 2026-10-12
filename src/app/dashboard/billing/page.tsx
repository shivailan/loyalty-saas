import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isBillingEnabled } from "@/lib/billing/config";
import { plans } from "@/lib/plans";
import { openBillingPortal, upgradeToBusiness } from "@/app/subscribe/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const STATUS_LABELS: Record<string, string> = {
  trialing: "Essai gratuit en cours",
  active: "Actif",
  past_due: "Paiement en retard",
  canceled: "Résilié",
  unpaid: "Impayé",
  incomplete: "Paiement non finalisé",
  incomplete_expired: "Paiement expiré",
  none: "Aucun abonnement",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BillingPage({
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
    .select(
      "billing_exempt, stripe_customer_id, subscription_status, subscription_plan, subscription_period_end",
    )
    .eq("owner_id", user.id)
    .single();
  if (!merchant) redirect("/login");

  const plan = plans.find((p) => p.id === merchant.subscription_plan);

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-neutral-900">Abonnement</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Votre formule, vos factures et votre moyen de paiement.
      </p>

      <Card className="mt-6">
        {merchant.billing_exempt ? (
          <p className="text-sm text-neutral-700">
            Votre compte est <strong>offert</strong> : aucun paiement n&apos;est
            nécessaire.
          </p>
        ) : !isBillingEnabled() ? (
          <p className="text-sm text-neutral-700">
            Le paiement en ligne n&apos;est pas encore activé.
          </p>
        ) : (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-neutral-500">Formule</dt>
              <dd className="font-medium text-neutral-900">
                {plan ? `${plan.name} · ${plan.price} €/mois` : "—"}
              </dd>
              <dt className="text-neutral-500">Statut</dt>
              <dd className="font-medium text-neutral-900">
                {STATUS_LABELS[merchant.subscription_status] ??
                  merchant.subscription_status}
              </dd>
              {merchant.subscription_period_end && (
                <>
                  <dt className="text-neutral-500">
                    {merchant.subscription_status === "trialing"
                      ? "Fin de l'essai"
                      : "Prochaine échéance"}
                  </dt>
                  <dd className="font-medium text-neutral-900">
                    {formatDate(merchant.subscription_period_end)}
                  </dd>
                </>
              )}
            </dl>
            {merchant.subscription_status === "past_due" && (
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Le dernier paiement a échoué. Mettez à jour votre moyen de
                paiement pour éviter la suspension de votre accès.
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm text-red-600">
                Impossible d&apos;ouvrir le portail pour le moment. Réessayez
                dans un instant.
              </p>
            )}
            {merchant.subscription_plan === "essentiel" && (
              <form action={upgradeToBusiness} className="mt-5">
                <Button type="submit">Passer à Business · 49,99 €/mois</Button>
              </form>
            )}
            {merchant.stripe_customer_id && (
              <form action={openBillingPortal} className="mt-3">
                <Button type="submit" variant="secondary">
                  Gérer mon abonnement et mes factures
                </Button>
              </form>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
