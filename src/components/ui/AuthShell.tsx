import Link from "next/link";
import { Card } from "./Card";
import { PhoneWalletMockup } from "@/components/landing/PhoneWalletMockup";
import { FloatingCard, TiltCard, Reveal } from "@/components/landing/Motion";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-neutral-950 px-12 py-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-400/25 via-amber-500/10 to-transparent blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:24px_24px]"
        />

        <Link href="/" className="relative flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-heading font-bold text-neutral-900">
            K
          </span>
          <span className="font-heading text-lg font-semibold text-white">
            KeepMe
          </span>
        </Link>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <TiltCard className="[transform-style:preserve-3d]">
            <FloatingCard>
              <div className="rotate-3">
                <PhoneWalletMockup />
              </div>
            </FloatingCard>
          </TiltCard>
        </div>

        <p className="relative max-w-sm font-heading text-2xl font-bold leading-snug text-white">
          Toutes leurs cartes de fidélité, dans un seul wallet.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-neutral-50 px-6 py-12 lg:w-1/2">
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 font-heading font-bold text-neutral-900">
            K
          </span>
          <span className="font-heading text-lg font-semibold text-neutral-900">
            KeepMe
          </span>
        </Link>
        <Reveal className="w-full max-w-sm">
          <Card className="w-full">{children}</Card>
        </Reveal>
      </div>
    </div>
  );
}
