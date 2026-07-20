"use server";

import { createClient } from "@/lib/supabase/server";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export async function signup(
  input: SignupInput,
): Promise<{ error: string | null }> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { business_name: parsed.data.businessName },
      emailRedirectTo: `${siteUrl}/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
