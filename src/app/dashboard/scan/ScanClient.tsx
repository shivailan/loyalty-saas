"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, Keyboard, RefreshCw, X, Zap } from "lucide-react";
import type QrScannerType from "qr-scanner";
import {
  addVisit,
  redeemReward,
  undoLastVisit,
  type AddVisitResult,
} from "./actions";

// Phase du scanner : la caméra reste allumée en permanence, seul le traitement
// des codes lus change selon la phase.
type Phase = "starting" | "scanning" | "processing" | "result" | "camera-error";

// La caméra relit le même QR code en boucle tant qu'il est visible : on
// ignore la même carte pendant quelques secondes.
const CAMERA_REPEAT_IGNORE_MS = 15_000;
// Retour automatique au scan suivant après une confirmation.
const AUTO_RESUME_MS = 4_000;
const AUTO_RESUME_AFTER_ACTION_MS = 2_500;

type Action = {
  pending: boolean;
  message: string | null;
  error: string | null;
};
const idleAction: Action = { pending: false, message: null, error: null };

function describeCameraError(error: unknown): string {
  const name =
    error instanceof DOMException
      ? error.name
      : typeof error === "object" && error && "name" in error
        ? String((error as { name: unknown }).name)
        : "";
  const text = String(error);
  if (name === "NotAllowedError" || text.includes("NotAllowed")) {
    return "L'accès à la caméra est bloqué. Autorisez la caméra pour ce site dans les réglages de votre navigateur, puis rechargez.";
  }
  if (name === "NotFoundError" || text.includes("Camera not found")) {
    return "Aucune caméra n'a été trouvée sur cet appareil.";
  }
  if (name === "NotReadableError") {
    return "La caméra est utilisée par une autre application. Fermez-la puis réessayez.";
  }
  return "Impossible de démarrer la caméra.";
}

function beep() {
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.12);
    oscillator.onended = () => void ctx.close();
  } catch {
    // Le son est un confort : on l'ignore s'il est bloqué.
  }
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  // Au-delà de 20 passages les pastilles deviendraient illisibles.
  if (total <= 0 || total > 20) return null;
  return (
    <div
      className="mt-3 flex flex-wrap justify-center gap-1.5"
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3 w-3 rounded-full ${i < current ? "bg-current" : "bg-current opacity-25"}`}
        />
      ))}
    </div>
  );
}

export function ScanClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScannerType | null>(null);
  const phaseRef = useRef<Phase>("starting");
  const lastSubmissionRef = useRef<{ cardId: string; at: number } | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const facingRef = useRef<"environment" | "user">("environment");

  const [phase, setPhaseState] = useState<Phase>("starting");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [hasFlash, setHasFlash] = useState(false);
  const [multipleCameras, setMultipleCameras] = useState(false);
  const [result, setResult] = useState<AddVisitResult | null>(null);
  const [lastCardId, setLastCardId] = useState<string | null>(null);
  const [redeem, setRedeem] = useState<Action>(idleAction);
  const [undo, setUndo] = useState<Action>(idleAction);
  const [autoResumeMs, setAutoResumeMs] = useState<number | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCardId, setManualCardId] = useState("");

  function setPhase(next: Phase) {
    phaseRef.current = next;
    setPhaseState(next);
  }

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    clearResumeTimer();
    setResult(null);
    setLastCardId(null);
    setRedeem(idleAction);
    setUndo(idleAction);
    setAutoResumeMs(null);
    phaseRef.current = "scanning";
    setPhaseState("scanning");
  }, [clearResumeTimer]);

  const scheduleResume = useCallback(
    (ms: number) => {
      clearResumeTimer();
      setAutoResumeMs(ms);
      resumeTimerRef.current = setTimeout(resume, ms);
    },
    [clearResumeTimer, resume],
  );

  async function submitCardId(cardIdRaw: string) {
    const cardId = cardIdRaw.trim();
    if (!cardId) return;
    if (
      phaseRef.current !== "scanning" &&
      phaseRef.current !== "camera-error"
    ) {
      return;
    }
    lastSubmissionRef.current = { cardId, at: Date.now() };
    setPhase("processing");
    setManualOpen(false);

    const res = await addVisit(cardId);
    setResult(res);
    setLastCardId(res.error ? null : cardId);
    setRedeem(idleAction);
    setUndo(idleAction);
    setPhase("result");

    if (!res.error) {
      beep();
      navigator.vibrate?.(res.rewardReached ? [80, 60, 80] : 60);
    } else {
      navigator.vibrate?.([120, 60, 120]);
    }
    // Une confirmation simple se referme seule ; une récompense à remettre
    // attend une action du commerçant.
    if (res.error) scheduleResume(res.tooSoon ? 3_000 : 5_000);
    else if (!res.rewardReached) scheduleResume(AUTO_RESUME_MS);
  }

  // Le démarrage de la caméra n'a lieu qu'une fois : elle appelle toujours la
  // version la plus récente du gestionnaire, via cette référence.
  const decodedHandlerRef = useRef(submitCardId);
  useEffect(() => {
    decodedHandlerRef.current = submitCardId;
  });

  function handleDecoded(data: string) {
    if (phaseRef.current !== "scanning") return;
    const cardId = data.trim();
    const last = lastSubmissionRef.current;
    if (
      last &&
      last.cardId === cardId &&
      Date.now() - last.at < CAMERA_REPEAT_IGNORE_MS
    ) {
      return;
    }
    void decodedHandlerRef.current(cardId);
  }
  const handleDecodedRef = useRef(handleDecoded);
  useEffect(() => {
    handleDecodedRef.current = handleDecoded;
  });

  useEffect(() => {
    let cancelled = false;
    let scanner: QrScannerType | null = null;

    (async () => {
      phaseRef.current = "starting";
      setPhaseState("starting");
      setCameraError(null);

      const { default: QrScanner } = await import("qr-scanner");
      if (cancelled || !videoRef.current) return;

      if (!(await QrScanner.hasCamera())) {
        setCameraError("Aucune caméra n'a été trouvée sur cet appareil.");
        phaseRef.current = "camera-error";
        setPhaseState("camera-error");
        return;
      }

      scanner = new QrScanner(
        videoRef.current,
        (decoded) => handleDecodedRef.current(decoded.data),
        {
          preferredCamera: "environment",
          maxScansPerSecond: 20,
          returnDetailedScanResult: true,
          highlightScanRegion: false,
          highlightCodeOutline: true,
          // Tout le carré visible à l'écran est analysé (et non seulement son
          // centre) : le QR code est lu où qu'il soit dans le cadre.
          calculateScanRegion: (video) => {
            const size = Math.min(video.videoWidth, video.videoHeight);
            return {
              x: Math.round((video.videoWidth - size) / 2),
              y: Math.round((video.videoHeight - size) / 2),
              width: size,
              height: size,
              downScaledWidth: Math.min(size, 900),
              downScaledHeight: Math.min(size, 900),
            };
          },
        },
      );
      scannerRef.current = scanner;
      facingRef.current = "environment";

      try {
        await scanner.start();
      } catch (error) {
        if (cancelled) return;
        setCameraError(describeCameraError(error));
        phaseRef.current = "camera-error";
        setPhaseState("camera-error");
        return;
      }
      if (cancelled) return;
      phaseRef.current = "scanning";
      setPhaseState("scanning");
      setHasFlash(await scanner.hasFlash().catch(() => false));
      setMultipleCameras(
        (await QrScanner.listCameras().catch(() => [])).length > 1,
      );
    })();

    return () => {
      cancelled = true;
      clearResumeTimer();
      scanner?.destroy();
      scannerRef.current = null;
    };
  }, [retryKey, clearResumeTimer]);

  async function handleRedeem() {
    if (!lastCardId) return;
    clearResumeTimer();
    setRedeem({ pending: true, message: null, error: null });
    const res = await redeemReward(lastCardId);
    if (res.error) {
      setRedeem({ pending: false, message: null, error: res.error });
      return;
    }
    setRedeem({
      pending: false,
      message: "Récompense offerte ! Le compteur est remis à zéro.",
      error: null,
    });
    scheduleResume(AUTO_RESUME_AFTER_ACTION_MS);
  }

  async function handleUndo() {
    if (!lastCardId) return;
    clearResumeTimer();
    setUndo({ pending: true, message: null, error: null });
    const res = await undoLastVisit(lastCardId);
    if (res.error) {
      setUndo({ pending: false, message: null, error: res.error });
      return;
    }
    setUndo({ pending: false, message: "Passage annulé.", error: null });
    scheduleResume(AUTO_RESUME_AFTER_ACTION_MS);
  }

  async function toggleFlash() {
    await scannerRef.current?.toggleFlash().catch(() => {});
  }

  // Bascule entre la caméra arrière (par défaut) et la caméra avant.
  async function switchCamera() {
    const next = facingRef.current === "environment" ? "user" : "environment";
    try {
      await scannerRef.current?.setCamera(next);
      facingRef.current = next;
      setHasFlash(await (scannerRef.current?.hasFlash() ?? false));
    } catch {
      // Si la bascule échoue, on garde la caméra actuelle.
    }
  }

  const success = result && !result.error;
  const reward = Boolean(success && result?.rewardReached);
  const actionDone = Boolean(redeem.message || undo.message);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-lg">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />

        {/* Cadre de visée */}
        {(phase === "scanning" || phase === "starting") && !cameraError && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[68%] w-[68%]">
              <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-yellow-400" />
              <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-yellow-400" />
              <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-yellow-400" />
              <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-yellow-400" />
            </div>
          </div>
        )}

        {phase === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 text-sm font-medium text-white">
            <Camera className="mr-2 h-5 w-5 animate-pulse" aria-hidden="true" />
            Démarrage de la caméra…
          </div>
        )}

        {phase === "scanning" && (
          <>
            <p className="absolute inset-x-0 bottom-4 text-center text-sm font-medium text-white drop-shadow">
              Placez le QR code du client dans le cadre
            </p>
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              {hasFlash && (
                <button
                  type="button"
                  onClick={toggleFlash}
                  aria-label="Allumer ou éteindre la lampe"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
                >
                  <Zap className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              {multipleCameras && (
                <button
                  type="button"
                  onClick={switchCamera}
                  aria-label="Changer de caméra"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
                >
                  <RefreshCw className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        )}

        {phase === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/70 text-base font-semibold text-white">
            Validation…
          </div>
        )}

        {phase === "camera-error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900 p-6 text-center text-white">
            <Camera className="h-10 w-10 text-yellow-400" aria-hidden="true" />
            <p className="text-sm text-neutral-200">{cameraError}</p>
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-neutral-900"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Résultat : grand, lisible à bout de bras */}
        {phase === "result" && result && (
          <div
            role="status"
            aria-live="polite"
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
              result.error
                ? "bg-red-600 text-white"
                : reward
                  ? "bg-yellow-400 text-neutral-900"
                  : "bg-emerald-600 text-white"
            }`}
          >
            {result.error ? (
              <>
                <X className="h-14 w-14" aria-hidden="true" />
                <p className="mt-3 text-lg font-semibold leading-snug">
                  {result.error}
                </p>
              </>
            ) : (
              <>
                <Check
                  className="h-14 w-14"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                <p className="mt-2 text-2xl font-bold">
                  {result.customerName || "Passage ajouté"}
                </p>
                <p className="mt-1 text-5xl font-extrabold tabular-nums">
                  {redeem.message
                    ? 0
                    : undo.message
                      ? "—"
                      : result.currentStamps}
                  <span className="text-2xl font-semibold opacity-80">
                    {" "}
                    / {result.visitsRequired}
                  </span>
                </p>
                {!actionDone && (
                  <ProgressDots
                    current={result.currentStamps ?? 0}
                    total={result.visitsRequired ?? 0}
                  />
                )}
                {reward && !actionDone && (
                  <p className="mt-3 text-lg font-bold">
                    Récompense atteinte !
                  </p>
                )}
                {redeem.message && (
                  <p className="mt-3 text-base font-semibold">
                    {redeem.message}
                  </p>
                )}
                {undo.message && (
                  <p className="mt-3 text-base font-semibold">{undo.message}</p>
                )}
                {(redeem.error || undo.error) && (
                  <p className="mt-3 rounded-lg bg-black/25 px-3 py-2 text-sm font-medium">
                    {redeem.error ?? undo.error}
                  </p>
                )}

                {!actionDone && (
                  <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
                    {reward && (
                      <button
                        type="button"
                        onClick={handleRedeem}
                        disabled={redeem.pending}
                        className="rounded-xl bg-neutral-900 px-5 py-3.5 text-base font-bold text-white disabled:opacity-60"
                      >
                        {redeem.pending
                          ? "Validation…"
                          : "Offrir la récompense"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={resume}
                      className={`rounded-xl px-5 py-3 text-sm font-semibold ${
                        reward
                          ? "bg-black/10 text-neutral-900"
                          : "bg-white text-emerald-800"
                      }`}
                    >
                      {reward ? "Plus tard" : "Scanner le suivant"}
                    </button>
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={undo.pending}
                      className="text-xs font-medium underline opacity-80 disabled:opacity-50"
                    >
                      {undo.pending ? "Annulation…" : "Annuler ce passage"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Compte à rebours avant le retour automatique au scan */}
            {autoResumeMs !== null && (
              <span
                key={`${result.currentStamps}-${autoResumeMs}`}
                className="absolute inset-x-0 bottom-0 h-1.5 origin-left bg-white/70"
                style={{
                  animation: `scan-resume ${autoResumeMs}ms linear forwards`,
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Saisie manuelle : secours si la caméra est indisponible */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <button
          type="button"
          onClick={() => setManualOpen((open) => !open)}
          className="flex w-full items-center gap-2 text-sm font-medium text-neutral-700"
          aria-expanded={manualOpen}
        >
          <Keyboard className="h-4 w-4" aria-hidden="true" />
          Saisir un code manuellement
        </button>
        {manualOpen && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submitCardId(manualCardId);
              setManualCardId("");
            }}
            className="mt-3 flex gap-2"
          >
            <input
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
              value={manualCardId}
              onChange={(event) => setManualCardId(event.target.value)}
              placeholder="Identifiant de la carte"
              aria-label="Identifiant de la carte"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={phase === "processing"}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-neutral-900 disabled:opacity-50"
            >
              Valider
            </button>
          </form>
        )}
      </div>

      <style>{`@keyframes scan-resume { from { transform: scaleX(1); } to { transform: scaleX(0); } }`}</style>
    </div>
  );
}
