export function DecorativeCard({
  name,
  className,
  side,
  top,
  bottom,
}: {
  name: string;
  className: string;
  side: "left" | "right";
  top?: string;
  bottom?: string;
}) {
  const sideClass =
    side === "left" ? "-left-20 -rotate-[18deg]" : "-right-16 rotate-[15deg]";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden ${sideClass} rounded-[1.75rem] shadow-xl lg:block ${className}`}
      style={{ width: "13rem", height: "8rem", top, bottom }}
    >
      <p className="p-4 text-sm font-semibold">{name}</p>
    </div>
  );
}
