"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { NavGroup } from "@/lib/nav-types";
import { iconMap } from "@/lib/icons";

function NavLinks({
  groups,
  onNavigate,
}: {
  groups: NavGroup[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {group.label}
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-yellow-100 text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** Barre latérale desktop : liste simple, toujours visible. */
export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  return <NavLinks groups={groups} />;
}

/** Version mobile : bouton qui déplie/replie la liste. */
export function MobileNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
          <NavLinks groups={groups} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
