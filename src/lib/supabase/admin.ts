import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Client "admin" : contourne RLS via la clé service_role.
 * Ne jamais importer ce fichier depuis un composant "use client" —
 * le paquet "server-only" fait planter le build si ça arrive.
 * Réservé aux flux publics (inscription client, scan de carte) qui ont
 * besoin de logique métier que RLS ne peut pas exprimer.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
