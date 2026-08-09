import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logout } from "@/app/dashboard/actions";
import { SidebarNav, MobileNav } from "@/components/ui/SidebarNav";
import { navGroups } from "./nav-items";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-50 md:flex">
      <aside className="hidden border-r border-neutral-200 bg-white md:flex md:w-64 md:shrink-0 md:flex-col md:justify-between md:px-4 md:py-6">
        <div>
          <Link href="/admin" className="flex items-center gap-2 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              K
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              KeepMe
            </span>
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
              Admin
            </span>
          </Link>
          <div className="mt-8">
            <SidebarNav groups={navGroups} />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Espace commerçant
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 md:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              K
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              KeepMe
            </span>
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
              Admin
            </span>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Se déconnecter
            </button>
          </form>
        </header>

        <div className="px-6 py-4 md:hidden">
          <MobileNav groups={navGroups} />
        </div>

        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
