const cards = [
  { name: "Boulangerie Martin", gradient: "from-yellow-300 to-amber-500" },
  { name: "Café Lumière", gradient: "from-blue-400 to-indigo-600" },
  { name: "Salon Éclat", gradient: "from-fuchsia-500 to-purple-700" },
  { name: "Garage Autoo", gradient: "from-emerald-400 to-teal-600" },
  { name: "Pizzeria Bella", gradient: "from-rose-400 to-red-600" },
  { name: "Fleuriste Iris", gradient: "from-pink-300 to-rose-500" },
];

function MiniCard({ name, gradient }: { name: string; gradient: string }) {
  return (
    <div
      className={`flex h-36 w-60 shrink-0 flex-col justify-between rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-xl`}
    >
      <p className="text-sm font-semibold text-white">{name}</p>
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i < 5 ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function CardMarquee() {
  const doubled = [...cards, ...cards];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max gap-6 animate-marquee">
        {doubled.map((card, i) => (
          <MiniCard key={i} {...card} />
        ))}
      </div>
    </div>
  );
}
