import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/safe-redirect";

const OTP_TYPES: EmailOtpType[] = [
  "recovery",
  "signup",
  "email",
  "invite",
  "magiclink",
  "email_change",
];

// Valide un lien reçu par email (réinitialisation de mot de passe…) à partir
// de son jeton. Contrairement à /auth/callback, cela fonctionne depuis
// n'importe quel appareil : on peut demander la réinitialisation sur
// l'ordinateur et ouvrir le mail sur son téléphone.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"));

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link`);
}
