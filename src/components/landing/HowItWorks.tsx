"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DecorativeCard } from "./DecorativeCard";

const steps = [
  {
    title: "Scan du QR code",
    description:
      "Affiché en caisse, unique à votre établissement. Le client le scanne avec son téléphone.",
    stamps: 0,
  },
  {
    title: "Inscription en 10 secondes",
    description:
      "Prénom, nom, email — aucune application à télécharger, aucun mot de passe à retenir.",
    stamps: 3,
  },
  {
    title: "Passages cumulés",
    description:
      "À chaque visite, vous scannez sa carte : le tampon s'ajoute automatiquement.",
    stamps: 6,
  },
  {
    title: "Récompense reçue",
    description:
      "Le seuil atteint, vous lui offrez sa récompense en un clic. Le compteur repart à zéro.",
    stamps: 8,
  },
];

const AUTO_ADVANCE_SECONDS = 4;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setActive((i) => (i + 1) % steps.length);
    }, AUTO_ADVANCE_SECONDS * 1000);
    return () => clearTimeout(id);
  }, [active, paused]);

  const current = steps[active];
  const rewardUnlocked = current.stamps >= 8;

  return (
    <section
      id="comment-ca-marche"
      className="relative overflow-hidden bg-neutral-50 py-32"
    >
      <DecorativeCard
        name="Salon Éclat"
        className="bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white opacity-70"
        side="left"
        top="14rem"
      />
      <DecorativeCard
        name="Café Lumière"
        className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white opacity-70"
        side="right"
        top="20rem"
      />

      <div className="px-6 lg:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Comment ça marche
          </span>
          <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Quatre étapes, zéro friction
          </h2>
          <p className="mt-4 text-sm text-neutral-400">
            Cliquez sur une étape, ou laissez-la défiler automatiquement.
          </p>
        </div>

        <div
          className="mx-auto mt-16 grid max-w-5xl gap-16 md:grid-cols-2 md:items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`cursor-pointer rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-neutral-200 bg-white shadow-sm"
                      : "border-neutral-200/70 bg-white/40 hover:border-neutral-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                        isActive
                          ? "bg-yellow-400 text-neutral-900"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3
                      className={`font-heading text-lg font-semibold tracking-tight transition-colors duration-300 ${
                        isActive ? "text-neutral-900" : "text-neutral-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p
                    className={`mt-2 pl-11 text-base transition-opacity duration-300 ${
                      isActive ? "text-neutral-500 opacity-100" : "opacity-0"
                    }`}
                  >
                    {step.description}
                  </p>
                  <div className="mt-3 ml-11 h-1 overflow-hidden rounded-full bg-neutral-200">
                    {isActive && (
                      <motion.div
                        key={active}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: AUTO_ADVANCE_SECONDS,
                          ease: "linear",
                        }}
                        className="h-full origin-left rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <div className="relative w-64">
              <div
                aria-hidden="true"
                className="absolute inset-x-4 -top-4 h-full rotate-3 rounded-[1.75rem] bg-gradient-to-br from-blue-400 to-indigo-600 opacity-90 shadow-xl"
              />
              <div className="relative -rotate-2 rounded-[1.75rem] bg-gradient-to-br from-yellow-300 to-amber-500 p-6 shadow-2xl">
                <p className="text-sm font-semibold text-neutral-900">
                  Boulangerie Martin
                </p>
                <p className="mt-1 text-xs text-neutral-800">Bonjour Julie</p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        backgroundColor:
                          i < current.stamps
                            ? "#171717"
                            : "rgba(23,23,23,0.15)",
                        scale: i < current.stamps ? [1, 1.3, 1] : 0.85,
                      }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      className="h-6 w-6 rounded-full"
                    />
                  ))}
                </div>

                <p className="mt-6 text-xs text-neutral-800">
                  {current.stamps} / 8 passages
                </p>

                <div className="mt-3 h-5">
                  <AnimatePresence>
                    {rewardUnlocked && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm font-semibold text-neutral-900"
                      >
                        Récompense débloquée !
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
