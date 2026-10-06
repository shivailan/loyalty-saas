import Link from "next/link";
import { currentYear } from "@/lib/dates";
import { legal } from "@/lib/legal";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-background py-8">
      <div className="flex flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-400 sm:flex-row lg:px-12">
        <p>© {currentYear()} KeepMe</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/mentions-legales" className="hover:text-neutral-900">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-neutral-900">
            Confidentialité
          </Link>
          <Link href="/cgu" className="hover:text-neutral-900">
            Conditions d’utilisation
          </Link>
          <Link href="/cgv" className="hover:text-neutral-900">
            Conditions de vente
          </Link>
          <a
            href={`mailto:${legal.contactEmail}`}
            className="hover:text-neutral-900"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
