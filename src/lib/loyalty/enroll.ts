import "server-only";
import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

export type EnrollInput = {
  merchantId: string;
  programId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  marketingConsent: boolean;
};

// Retrouve (ou crée) le client d'un commerçant et sa carte pour un programme.
// Partagé par l'inscription depuis la page /join et par la liaison avec une
// application de commande : un client est unique par (commerçant, email).
export async function findOrCreateCard(
  supabase: AdminClient,
  input: EnrollInput,
): Promise<
  | { error: string }
  | { error: null; cardId: string; customerId: string; isNewCustomer: boolean }
> {
  const email = input.email.trim().toLowerCase();

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("merchant_id", input.merchantId)
    .eq("email", email)
    .maybeSingle();

  let customerId = existingCustomer?.id as string | undefined;
  const isNewCustomer = !customerId;

  if (!customerId) {
    const { data: newCustomer, error } = await supabase
      .from("customers")
      .insert({
        merchant_id: input.merchantId,
        first_name: input.firstName,
        last_name: input.lastName,
        email,
        phone: input.phone || null,
        marketing_consent: input.marketingConsent,
        marketing_consent_at: input.marketingConsent
          ? new Date().toISOString()
          : null,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    customerId = newCustomer.id;
  }

  const { data: existingCard } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("customer_id", customerId)
    .eq("loyalty_program_id", input.programId)
    .maybeSingle();

  let cardId = existingCard?.id as string | undefined;

  if (!cardId) {
    const { data: newCard, error } = await supabase
      .from("loyalty_cards")
      .insert({
        customer_id: customerId,
        loyalty_program_id: input.programId,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    cardId = newCard.id;
  }

  return { error: null, cardId, customerId, isNewCustomer };
}
