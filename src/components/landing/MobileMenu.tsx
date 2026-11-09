"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/commande-a-emporter", label: "Order" },
  { href: "/carte-de-fidelite", label: "Card" },
  { href: "/tarifs", label: "Tarifs" },
];

// Menu des petits écrans : un bouton « burger » qui déplie les liens du haut de
// page. Se referme dès qu'on touche un lien.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav
          id="menu-mobile"
          className="absolute inset-x-0 top-full border-b border-neutral-200 bg-white px-6 py-4 shadow-lg"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-neutral-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-neutral-100 pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-medium text-neutral-800"
              >
                Se connecter
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
