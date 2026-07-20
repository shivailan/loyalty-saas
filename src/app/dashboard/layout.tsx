import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

const navLinks = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/program", label: "Programme" },
  { href: "/dashboard/branding", label: "Apparence" },
  { href: "/dashboard/qr-code", label: "QR code" },
  { href: "/dashboard/scan", label: "Scanner" },
  { href: "/dashboard/stats", label: "Statistiques" },
  { href: "/dashboard/notifications", label: "Notifications" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("is_suspended")
    .single();

  if (merchant?.is_suspended) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
        <div className="max-w-sm rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-neutral-900">
            Compte suspendu
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            L&apos;accès à votre espace commerçant a été temporairement
            suspendu. Contactez le support pour plus d&apos;informations.
          </p>
          <form action={logout} className="mt-4">
            <button
              type="submit"
              className="text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              F
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              Fidelio
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-sm text-neutral-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
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
