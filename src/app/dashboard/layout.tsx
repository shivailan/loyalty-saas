import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import { SidebarNav, MobileNav } from "@/components/ui/SidebarNav";
import { navGroups } from "./nav-items";

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
    <div className="min-h-screen bg-neutral-50 md:flex">
      <aside className="hidden border-r border-neutral-200 bg-white md:flex md:w-64 md:shrink-0 md:flex-col md:justify-between md:px-4 md:py-6">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              K
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              KeepMe
            </span>
          </Link>
          <div className="mt-8">
            <SidebarNav groups={navGroups} />
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Se déconnecter
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
              K
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              KeepMe
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
