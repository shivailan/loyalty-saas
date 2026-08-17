import { currentYear } from "@/lib/dates";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-background py-8">
      <div className="flex flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-500 sm:flex-row lg:px-12">
        <p>© {currentYear()} KeepMe</p>
        <p>Cartes de fidélité digitales pour commerçants</p>
      </div>
    </footer>
  );
}
