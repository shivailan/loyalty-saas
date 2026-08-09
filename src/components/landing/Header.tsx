import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-heading font-bold text-neutral-900">
            K
          </span>
          <span className="font-heading text-lg font-semibold text-neutral-900">
            KeepMe
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <a className="hover:text-neutral-900" href="#comment-ca-marche">
            Comment ça marche
          </a>
          <a className="hover:text-neutral-900" href="#fonctionnalites">
            Fonctionnalités
          </a>
          <a className="hover:text-neutral-900" href="#tarifs">
            Tarifs
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-neutral-700 hover:text-neutral-900 sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
