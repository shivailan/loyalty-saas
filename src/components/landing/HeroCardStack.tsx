export function HeroCardStack() {
  return (
    <div className="relative h-[420px] w-[320px] sm:h-[460px] sm:w-[360px]">
      <div className="absolute inset-x-8 top-0 h-[260px] -rotate-[10deg] rounded-[2rem] bg-gradient-to-br from-fuchsia-500 to-purple-700 shadow-xl" />

      <div className="absolute inset-x-4 top-8 h-[260px] rotate-[6deg] rounded-[2rem] bg-gradient-to-br from-blue-400 to-indigo-600 shadow-xl" />

      <div className="absolute inset-x-0 top-20 -rotate-[2deg] rounded-[2rem] bg-gradient-to-br from-yellow-300 to-amber-500 p-7 shadow-2xl">
        <p className="text-lg font-semibold text-neutral-900">
          Boulangerie Martin
        </p>
        <p className="mt-0.5 text-sm text-neutral-800">Bonjour Julie</p>

        <div className="mt-10">
          <div className="flex justify-between text-xs font-semibold text-neutral-900">
            <span>6 / 8 passages</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-900/20">
            <div className="h-2 w-3/4 rounded-full bg-neutral-900" />
          </div>
          <p className="mt-2 text-xs text-neutral-800">
            Récompense : un café offert
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i < 6 ? "bg-neutral-900" : "bg-neutral-900/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
