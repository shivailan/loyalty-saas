"use client";

import { QRCodeCanvas } from "qrcode.react";

export function CardQrCode({ cardId }: { cardId: string }) {
  return (
    <div className="flex justify-center rounded-xl border border-neutral-200 bg-white p-4">
      <QRCodeCanvas
        value={cardId}
        size={224}
        level="M"
        marginSize={2}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
}
