import Link from "next/link";
import { Card } from "./Card";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-bold text-neutral-900">
          F
        </span>
        <span className="text-lg font-semibold text-neutral-900">
          Fidelio
        </span>
      </Link>
      <Card className="w-full max-w-sm">{children}</Card>
    </div>
  );
}
