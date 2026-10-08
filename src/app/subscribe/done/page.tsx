import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/billing/stripe";
import { syncSubscription } from "@/lib/billing/sync";

// Retour de Stripe après le paiement. On relit la session auprès de Stripe et
// on met l'abonnement à jour tout de suite, sans attendre le webhook : le
// commerçant arrive ainsi directement sur un espace déjà débloqué.
export default async function SubscribeDonePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/subscribe");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: merchant } = await supabase
    .from("merchants")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!merchant) redirect("/login");

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });
    // La session doit appartenir à ce commerçant.
    if (
      session.client_reference_id === merchant.id &&
      session.subscription &&
      typeof session.subscription !== "string"
    ) {
      await syncSubscription(session.subscription);
    }
  } catch (error) {
    console.error("Stripe return sync failed:", error);
  }
  redirect("/dashboard");
}
