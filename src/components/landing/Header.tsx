import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-100/80 bg-white/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3.5 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 font-heading text-sm font-semibold text-neutral-900">
            K
          </span>
          <span className="font-heading text-[15px] font-semibold text-neutral-900">
            KeepMe
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-[13px] font-medium text-neutral-500 md:flex">
          <a className="transition-colors hover:text-neutral-900" href="#comment-ca-marche">
            Comment ça marche
          </a>
          <a className="transition-colors hover:text-neutral-900" href="#fonctionnalites">
            Fonctionnalités
          </a>
          <a className="transition-colors hover:text-neutral-900" href="#tarifs">
            Tarifs
          </a>
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="hidden text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-yellow-400 px-4 py-2 text-[13px] font-semibold text-neutral-900 transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-[0.98]"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
