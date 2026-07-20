"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/Button";

export function QrCodeDisplay({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr-code-fidelite.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="rounded-xl border border-neutral-200 p-4"
      >
        <QRCodeCanvas value={url} size={256} level="M" />
      </div>
      <Button type="button" onClick={handleDownload}>
        Télécharger le QR code
      </Button>
    </div>
  );
}
