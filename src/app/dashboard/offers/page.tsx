import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOfferAudience } from "@/lib/wallet/offers";
import { OfferForm } from "./OfferForm";
import { Card } from "@/components/ui/Card";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Hors du composant : lire l'heure courante n'est pas permis pendant le rendu.
function cooldownMessage(lastSentAt: string | undefined): string | null {
  if (!lastSentAt) return null;
  const nextAt = new Date(lastSentAt).getTime() + COOLDOWN_MS;
  if (nextAt <= Date.now()) return null;
  return `Vous avez déjà envoyé une offre le ${formatDate(lastSentAt)}. Prochain envoi possible ${formatDate(new Date(nextAt).toISOString())}.`;
}

export default async function OffersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();
  if (!merchant) {
    redirect("/login");
  }

  const [{ data: offers }, audience, { count: consentCount }] =
    await Promise.all([
      supabase
        .from("wallet_offers")
        .select("id, message, recipients_count, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      getOfferAudience(merchant.id),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("marketing_consent", true),
    ]);

  const blockedMessage = cooldownMessage(offers?.[0]?.created_at);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900">Offres Wallet</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Envoyez une offre qui s&apos;affiche en notification sur l&apos;écran
        verrouillé de vos clients, comme une application.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-3xl font-bold text-neutral-900">
            {audience.count}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            client{audience.count > 1 ? "s" : ""} joignable
            {audience.count > 1 ? "s" : ""} maintenant
          </p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-neutral-900">
            {consentCount ?? 0}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            client{(consentCount ?? 0) > 1 ? "s" : ""} ayant accepté les offres
          </p>
        </Card>
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        Sont joignables les clients qui ont accepté de recevoir des offres{" "}
        <strong>et</strong> ajouté leur carte à Apple Wallet. Les autres ne
        reçoivent que les notifications de passage. Un seul message par jour
        peut être envoyé.
      </p>

      <Card className="mt-6">
        <OfferForm
          merchantName={merchant.name}
          audienceCount={audience.count}
          blockedMessage={blockedMessage}
        />
      </Card>

      {offers && offers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-neutral-900">
            Dernières offres envoyées
          </h2>
          <ul className="mt-3 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
            {offers.map((offer) => (
              <li key={offer.id} className="px-4 py-3">
                <p className="text-sm text-neutral-900">{offer.message}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {formatDate(offer.created_at)} · {offer.recipients_count}{" "}
                  client{offer.recipients_count > 1 ? "s" : ""} notifié
                  {offer.recipients_count > 1 ? "s" : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
