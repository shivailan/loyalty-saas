"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Barre de progression en haut de l'écran : elle démarre dès le clic sur un
// lien interne et se termine quand la nouvelle page est affichée. Sans elle,
// quelques secondes sans aucun signe visuel font croire que le site est cassé.
//
// On retient la page où se trouvait l'utilisateur au moment du clic : tant que
// l'adresse n'a pas changé, la navigation est en cours ; dès qu'elle change,
// elle est terminée.
export function NavigationProgress() {
  const pathname = usePathname();
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const loading = startedAt !== null && pathname === startedAt;
  const done = startedAt !== null && pathname !== startedAt;

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest("a");
      if (
        !anchor ||
        !anchor.href ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (
        url.pathname === location.pathname &&
        url.search === location.search
      ) {
        return;
      }
      setStartedAt(location.pathname);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // La barre terminée disparaît ; et si la navigation n'aboutit pas (erreur
  // réseau), elle ne reste pas bloquée indéfiniment.
  useEffect(() => {
    if (startedAt === null) return;
    const timer = setTimeout(() => setStartedAt(null), done ? 600 : 15_000);
    return () => clearTimeout(timer);
  }, [startedAt, done]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1"
    >
      <div
        className="h-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
        style={{
          width: done ? "100%" : loading ? "85%" : "0%",
          opacity: startedAt === null ? 0 : 1,
          transition: loading
            ? "width 8s cubic-bezier(0.1, 0.7, 0.2, 1)"
            : done
              ? "width 0.2s ease-out, opacity 0.3s ease 0.3s"
              : "none",
        }}
      />
    </div>
  );
}
