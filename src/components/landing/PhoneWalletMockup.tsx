import { Wifi, BatteryFull } from "lucide-react";

export function PhoneWalletMockup() {
  return (
    <div className="relative h-[540px] w-64 rounded-[3rem] border-[6px] border-neutral-800 bg-neutral-950 shadow-2xl sm:h-[580px] sm:w-72">
      <div className="absolute left-1/2 top-3 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

      <div className="absolute inset-0 overflow-hidden rounded-[2.6rem] px-5 pt-12">
        <div className="flex items-center justify-between text-xs font-semibold text-white">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-white">
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>

        <p className="mt-6 text-2xl font-bold text-white">Wallet</p>

        <div className="relative mt-6 h-[400px]">
          {/* Carte 1 (arrière-plan) */}
          <div className="absolute inset-x-0 top-0 rounded-[1.5rem] bg-gradient-to-br from-neutral-700 to-neutral-800 px-5 py-4 shadow-lg">
            <p className="text-xs font-medium text-neutral-300">
              Café Lumière
            </p>
          </div>

          {/* Carte 2 (milieu) */}
          <div className="absolute inset-x-0 top-14 rounded-[1.5rem] bg-gradient-to-br from-fuchsia-800 to-purple-900 px-5 py-4 shadow-lg">
            <p className="text-xs font-medium text-purple-200">
              Salon Éclat
            </p>
          </div>

          {/* Carte 3 (premier plan — notre carte, dépliée) */}
          <div className="absolute inset-x-0 top-28 rounded-[1.5rem] bg-gradient-to-br from-yellow-300 to-amber-500 p-5 shadow-xl">
            <p className="text-sm font-semibold text-neutral-900">
              Boulangerie Martin
            </p>
            <p className="mt-0.5 text-xs text-neutral-800">Bonjour Julie</p>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-medium text-neutral-900">
                <span>6 / 8 passages</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-900/20">
                <div className="h-1.5 w-3/4 rounded-full bg-neutral-900" />
              </div>
              <p className="mt-1.5 text-xs text-neutral-800">
                Récompense : un café offert
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-sm ${
                      i % 5 === 0 ? "bg-neutral-900" : "bg-neutral-900/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
