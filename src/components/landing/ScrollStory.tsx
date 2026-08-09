"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const steps = [
  {
    title: "Scan du QR code",
    description:
      "Affiché en caisse, unique à votre établissement. Le client le scanne avec son téléphone.",
  },
  {
    title: "Inscription en 10 secondes",
    description:
      "Prénom, nom, email — aucune application à télécharger, aucun mot de passe à retenir.",
  },
  {
    title: "Passages cumulés",
    description:
      "À chaque visite, vous scannez sa carte : le tampon s'ajoute automatiquement.",
  },
  {
    title: "Récompense reçue",
    description:
      "Le seuil atteint, vous lui offrez sa récompense en un clic. Le compteur repart à zéro.",
  },
];

const stampsPerStep = [0, 3, 6, 8];

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(steps.length - 1, Math.floor(latest * steps.length));
    setActiveStep(index);
  });

  const stamps = stampsPerStep[activeStep];
  const rewardUnlocked = stamps >= 8;

  const blobLeft = useTransform(scrollYProgress, [0, 1], ["10%", "70%"]);
  const blobTop = useTransform(scrollYProgress, [0, 1], ["10%", "75%"]);
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section
      id="comment-ca-marche"
      ref={containerRef}
      className="relative bg-neutral-800"
      style={{ height: `${steps.length * 85}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:24px_24px]"
        />
        <motion.div
          aria-hidden="true"
          style={{ left: blobLeft, top: blobTop, rotate: blobRotate }}
          className="pointer-events-none absolute h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-400/20 via-amber-500/10 to-transparent blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl"
        />

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs font-medium text-neutral-400"
        >
          <span>Scrollez pour découvrir</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>

        <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center">
          <div className="flex gap-6">
            <div className="relative hidden w-1 shrink-0 self-stretch overflow-hidden rounded-full bg-white/10 sm:block">
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="absolute inset-0 origin-top rounded-full bg-yellow-400"
              />
            </div>

            <div className="flex flex-col gap-10">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`transition-opacity duration-500 ${
                    i === activeStep ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-500 ${
                        i === activeStep
                          ? "bg-yellow-400 text-neutral-900"
                          : "bg-white/10 text-neutral-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 pl-11 text-sm text-neutral-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 rounded-[1.75rem] border border-white/15 bg-neutral-900 p-6 shadow-2xl"
            >
              <p className="text-sm font-semibold text-white">
                Boulangerie Martin
              </p>
              <p className="mt-1 text-xs text-neutral-400">Bonjour Julie</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      backgroundColor:
                        i < stamps ? "#facc15" : "rgba(255,255,255,0.08)",
                      scale: i < stamps ? [1, 1.3, 1] : 0.85,
                    }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="h-6 w-6 rounded-full"
                  />
                ))}
              </div>

              <p className="mt-6 text-xs text-neutral-400">
                {stamps} / 8 passages
              </p>

              <div className="mt-3 h-5">
                {rewardUnlocked && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm font-semibold text-yellow-300"
                  >
                    Récompense débloquée !
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
