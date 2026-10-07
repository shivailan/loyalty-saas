// N'accepte qu'un chemin interne du site (« /reset-password »). Sans ce
// contrôle, un lien piégé du type « ?next=@autre-site.com » enverrait
// l'utilisateur vers un site tiers après connexion.
export function safeNextPath(next: string | null, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
