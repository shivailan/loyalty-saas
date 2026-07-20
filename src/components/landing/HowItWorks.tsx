import { ArrowRight } from "lucide-react";
import { Reveal, RevealSide, RevealGroup, RevealItem } from "./Motion";

const steps = [
  "Scan du QR code",
  "Inscription en 10s",
  "Passages cumulés",
  "Récompense reçue",
];

function PaperCardIllustration() {
  return (
    <svg
      width="200"
      height="130"
      viewBox="0 0 200 130"
      className="drop-shadow-sm"
      aria-hidden="true"
    >
      <g transform="rotate(-7 100 65)">
        <rect
          x="15"
          y="15"
          width="170"
          height="95"
          rx="10"
          fill="#fafaf9"
          stroke="#d4d4d4"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <line
          x1="15"
          y1="65"
          x2="185"
          y2="63"
          stroke="#e5e5e5"
          strokeWidth="1.5"
        />
        <rect x="30" y="30" width="60" height="7" rx="3.5" fill="#e5e5e5" />
        <rect x="30" y="42" width="42" height="5" rx="2.5" fill="#e5e5e5" />
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={i}
            cx={32 + i * 19}
            cy={90}
            r="6.5"
            fill={i < 5 ? "#d4d4d4" : "none"}
            stroke="#a3a3a3"
            strokeWidth="1.5"
          />
        ))}
      </g>
    </svg>
  );
}

function PhoneCardIllustration() {
  return (
    <div className="w-44 rounded-[1.5rem] border border-neutral-200 bg-neutral-900 p-2 shadow-lg">
      <div className="rounded-[1.1rem] bg-white p-4">
        <div className="h-2 w-16 rounded-full bg-neutral-200" />
        <div className="mt-1.5 h-1.5 w-10 rounded-full bg-neutral-100" />
        <div className="mt-4 flex flex-wrap gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < 6 ? "bg-yellow-400" : "bg-neutral-100"
              }`}
            />
          ))}
        </div>
        <div className="mt-4 h-1.5 w-24 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-neutral-900">
            Fini les cartes perdues
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-neutral-600">
            Avant, une carte en papier qu&apos;on froisse et qu&apos;on
            oublie. Maintenant, toujours dans la poche.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-10">
          <RevealSide from="left" className="flex flex-col items-center">
            <PaperCardIllustration />
            <p className="mt-4 text-sm font-medium text-neutral-500">
              Avant
            </p>
          </RevealSide>

          <Reveal delay={0.25}>
            <ArrowRight className="h-6 w-6 rotate-90 text-neutral-300 md:rotate-0" />
          </Reveal>

          <RevealSide
            from="right"
            delay={0.1}
            className="flex flex-col items-center"
          >
            <PhoneCardIllustration />
            <p className="mt-4 text-sm font-medium text-neutral-900">
              Maintenant
            </p>
          </RevealSide>
        </div>

        <RevealGroup className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {steps.map((step, index) => (
            <RevealItem
              key={step}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-semibold text-neutral-900">
                {index + 1}
              </div>
              <p className="mt-2 text-sm font-medium text-neutral-700">
                {step}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
