"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// La suppression d'un client entraîne celle de sa carte, de ses passages et
// de ses récompenses (suppression en cascade en base). Les règles RLS
// garantissent qu'un commerçant ne peut supprimer que ses propres clients.
export async function deleteCustomer(
  customerId: string,
): Promise<{ error: string | null }> {
  const parsed = z.string().uuid().safeParse(customerId);
  if (!parsed.success) {
    return { error: "Client invalide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { data, error } = await supabase
    .from("customers")
    .delete()
    .eq("id", parsed.data)
    .select("id");

  if (error) {
    return { error: "Impossible de supprimer ce client, veuillez réessayer." };
  }
  if (!data || data.length === 0) {
    return { error: "Client introuvable." };
  }

  return { error: null };
}
