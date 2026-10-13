// Affiché immédiatement pendant le chargement d'une page de l'espace
// commerçant : le menu reste en place et le contenu montre qu'il arrive.
export default function DashboardLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Chargement en cours">
      <span className="sr-only">Chargement en cours…</span>
      <div className="animate-pulse">
        <div className="h-8 w-56 rounded-lg bg-neutral-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-neutral-200" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <div className="h-10 w-10 rounded-lg bg-neutral-200" />
              <div className="mt-4 h-4 w-32 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-full rounded bg-neutral-100" />
              <div className="mt-1.5 h-3 w-2/3 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
