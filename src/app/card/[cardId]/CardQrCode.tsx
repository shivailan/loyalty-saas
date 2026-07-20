"use client";

import { QRCodeCanvas } from "qrcode.react";

export function CardQrCode({ cardId }: { cardId: string }) {
  return (
    <div className="flex justify-center rounded-xl border border-neutral-200 p-4">
      <QRCodeCanvas value={cardId} size={200} level="M" />
    </div>
  );
}
