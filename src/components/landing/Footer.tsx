import { currentYear } from "@/lib/dates";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-500 sm:flex-row">
        <p>© {currentYear()} Fidelio</p>
        <p>Cartes de fidélité digitales pour commerçants</p>
      </div>
    </footer>
  );
}
