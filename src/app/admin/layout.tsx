import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logout } from "@/app/dashboard/actions";

const navLinks = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/merchants", label: "Commerçants" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              F
            </span>
            <span className="text-lg font-semibold text-white">Fidelio</span>
            <span className="rounded-full bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-200">
              Admin
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-sm text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" className="hover:text-white">
              Espace commerçant
            </Link>
          </nav>

          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-neutral-300 hover:text-white"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
