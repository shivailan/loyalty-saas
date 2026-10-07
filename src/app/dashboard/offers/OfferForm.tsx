"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { OFFER_MAX_LENGTH } from "@/lib/validations/offer";
import { sendOffer } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export function OfferForm({
  merchantName,
  audienceCount,
  blockedMessage,
}: {
  merchantName: string;
  audienceCount: number;
  blockedMessage: string | null;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<number | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (audienceCount > 0) {
      const ok = window.confirm(
        `Envoyer cette offre à ${audienceCount} client${audienceCount > 1 ? "s" : ""} ? Vous ne pourrez plus en envoyer pendant 24 h.`,
      );
      if (!ok) return;
    }
    setServerError(null);
    setSentTo(null);
    setSending(true);
    const result = await sendOffer({ message });
    setSending(false);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSentTo(result.recipients ?? 0);
    setMessage("");
  }

  const disabled = sending || blockedMessage !== null;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass} htmlFor="message">
          Votre message
        </label>
        <textarea
          id="message"
          rows={3}
          maxLength={OFFER_MAX_LENGTH}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ex. -20 % sur les viennoiseries ce samedi !"
          disabled={blockedMessage !== null}
          className={`mt-1 resize-none ${inputClass}`}
        />
        <p className="mt-1 text-right text-xs text-neutral-500">
          {message.length} / {OFFER_MAX_LENGTH}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Aperçu sur l&apos;écran verrouillé
        </p>
        <div className="mt-2 rounded-2xl bg-neutral-100 p-3">
          <div className="rounded-xl bg-white/90 px-3 py-2.5 shadow-sm">
            <p className="text-xs font-semibold text-neutral-500">
              Wallet · {merchantName}
            </p>
            <p className="mt-0.5 text-sm text-neutral-900">
              {message.trim() || "Votre message apparaîtra ici."}
            </p>
          </div>
        </div>
      </div>

      {blockedMessage && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {blockedMessage}
        </p>
      )}
      {serverError && <p className={errorClass}>{serverError}</p>}
      {sentTo !== null && (
        <p className={successClass}>
          {sentTo > 0
            ? `Offre envoyée à ${sentTo} client${sentTo > 1 ? "s" : ""}. La notification arrive en quelques secondes.`
            : "Offre enregistrée. Aucun client n'a encore sa carte dans Wallet avec les offres acceptées : personne n'a été notifié pour l'instant."}
        </p>
      )}

      <Button
        type="submit"
        disabled={disabled || message.trim().length < 3}
        className="w-fit"
      >
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        {sending ? "Envoi..." : "Envoyer l'offre"}
      </Button>
    </form>
  );
}
