import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasLoyalty } from "@/lib/billing/access";

// Toutes les pages de la carte de fidélité passent ici : un abonné KeepMe
// Commande seul n'y a pas droit, même en tapant l'adresse à la main.
export default async function LoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: merchant } = await supabase
    .from("merchants")
    .select("billing_exempt, offer")
    .single();
  if (merchant && !hasLoyalty(merchant)) redirect("/dashboard");
  return children;
}
