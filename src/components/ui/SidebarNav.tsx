"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, Menu, X } from "lucide-react";
import type { NavGroup } from "@/lib/nav-types";
import { LOCKED_MESSAGE, type FeatureKey } from "@/lib/features";
import { iconMap } from "@/lib/icons";
import type { LucideIcon } from "lucide-react";

// Dans un lien : l'icône devient un petit cercle qui tourne dès le clic, pour
// montrer que la page se charge.
function NavIcon({ Icon }: { Icon: LucideIcon }) {
  const { pending } = useLinkStatus();
  return pending ? (
    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-yellow-600" />
  ) : (
    <Icon className="h-4 w-4 shrink-0" />
  );
}

function NavLinks({
  groups,
  locked = [],
  onNavigate,
}: {
  groups: NavGroup[];
  locked?: FeatureKey[];
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
              const isLocked = Boolean(
                item.feature && locked.includes(item.feature),
              );
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-label={
                    isLocked ? `${item.label} : ${LOCKED_MESSAGE}` : undefined
                  }
                  className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-yellow-100 text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <NavIcon Icon={Icon} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {isLocked && (
                    <>
                      <span
                        aria-hidden="true"
                        className="ml-auto flex shrink-0 items-center gap-0.5 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-500"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        Business
                      </span>
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden w-56 -translate-y-1/2 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-normal leading-snug text-white shadow-lg group-hover:block group-focus-visible:block"
                      >
                        {LOCKED_MESSAGE}
                      </span>
                    </>
                  )}
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
export function SidebarNav({
  groups,
  locked,
}: {
  groups: NavGroup[];
  locked?: FeatureKey[];
}) {
  return <NavLinks groups={groups} locked={locked} />;
}

/** Version mobile : bouton qui déplie/replie la liste. */
export function MobileNav({
  groups,
  locked,
}: {
  groups: NavGroup[];
  locked?: FeatureKey[];
}) {
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
          <NavLinks
            groups={groups}
            locked={locked}
            onNavigate={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
