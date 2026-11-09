// Message lisible quand Supabase refuse la vérification anti-robot.
export function captchaAwareError(message: string): string {
  return /captcha/i.test(message)
    ? "La vérification anti-robot a échoué. Réessayez."
    : message;
}
