"use client";

import { useEffect, useRef, useState } from "react";
import { addVisit, redeemReward, type AddVisitResult } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export function ScanClient() {
  const [manualCardId, setManualCardId] = useState("");
  const [result, setResult] = useState<AddVisitResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [lastCardId, setLastCardId] = useState<string | null>(null);
  const [redeemState, setRedeemState] = useState<{
    pending: boolean;
    message: string | null;
    error: string | null;
  }>({ pending: false, message: null, error: null });
  const isScanningRef = useRef(false);

  async function submitCardId(cardId: string) {
    if (isScanningRef.current) return;
    isScanningRef.current = true;
    setIsPending(true);
    setResult(null);
    setRedeemState({ pending: false, message: null, error: null });
    const res = await addVisit(cardId);
    setResult(res);
    setLastCardId(res.error ? null : cardId);
    setIsPending(false);
    isScanningRef.current = false;
  }

  async function handleRedeem() {
    if (!lastCardId) return;
    setRedeemState({ pending: true, message: null, error: null });
    const res = await redeemReward(lastCardId);
    if (res.error) {
      setRedeemState({ pending: false, message: null, error: res.error });
      return;
    }
    setRedeemState({
      pending: false,
      message: "Récompense offerte ! Le compteur a été réinitialisé.",
      error: null,
    });
    setResult((prev) =>
      prev ? { ...prev, currentStamps: 0, rewardReached: false } : prev,
    );
  }

  useEffect(() => {
    let isMounted = true;
    let scannerInstance: import("html5-qrcode").Html5QrcodeScanner | null =
      null;

    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      if (!isMounted) return;
      scannerInstance = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false,
      );
      scannerInstance.render(
        (decodedText) => {
          submitCardId(decodedText);
        },
        () => {
          // ignore: called continuously while no QR code is visible
        },
      );
    });

    return () => {
      isMounted = false;
      scannerInstance?.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-6">
      <Card>
        <div id="qr-reader" />
      </Card>

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCardId(manualCardId.trim());
          }}
          className="flex flex-col gap-2"
        >
          <label className={labelClass} htmlFor="manualCardId">
            Ou saisissez l&apos;identifiant de la carte manuellement
          </label>
          <input
            id="manualCardId"
            className={inputClass}
            value={manualCardId}
            onChange={(e) => setManualCardId(e.target.value)}
          />
          <Button type="submit" disabled={isPending} className="mt-1">
            {isPending ? "Validation..." : "Ajouter un passage"}
          </Button>
        </form>
      </Card>

      {result && (
        <Card>
          {result.error ? (
            <p className={errorClass}>{result.error}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-neutral-900">
                {result.customerName}
              </p>
              <p className="text-sm text-neutral-600">
                {result.currentStamps} / {result.visitsRequired} passages
              </p>
              {result.rewardReached && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-yellow-700">
                    Seuil atteint ! Ce client peut recevoir sa récompense.
                  </p>
                  <Button
                    type="button"
                    onClick={handleRedeem}
                    disabled={redeemState.pending}
                    className="mt-2"
                  >
                    {redeemState.pending
                      ? "Validation..."
                      : "Offrir la récompense"}
                  </Button>
                </div>
              )}
              {redeemState.message && (
                <p className={`mt-2 ${successClass}`}>
                  {redeemState.message}
                </p>
              )}
              {redeemState.error && (
                <p className={`mt-2 ${errorClass}`}>{redeemState.error}</p>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  );
}
