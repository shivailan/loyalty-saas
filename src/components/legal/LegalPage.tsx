import Link from "next/link";
import { legal } from "@/lib/legal";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 font-heading text-sm font-semibold text-neutral-900">
              K
            </span>
            <span className="font-heading text-[15px] font-semibold text-neutral-900">
              {legal.productName}
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Retour au site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Dernière mise à jour : {legal.lastUpdated}
        </p>
        <div className="mt-10 flex flex-col gap-8">{children}</div>

        <nav className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-100 pt-6 text-sm text-neutral-500">
          <Link href="/mentions-legales" className="hover:text-neutral-900">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-neutral-900">
            Politique de confidentialité
          </Link>
          <Link href="/cgu" className="hover:text-neutral-900">
            Conditions d’utilisation
          </Link>
        </nav>
      </main>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-neutral-600">
        {children}
      </div>
    </section>
  );
}
