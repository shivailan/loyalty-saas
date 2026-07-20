"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { errorClass, successClass } from "@/lib/ui";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];
const MAX_SIZE = 2 * 1024 * 1024;

export function LogoUploader({
  merchantId,
  initialLogoUrl,
}: {
  merchantId: string;
  initialLogoUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format non supporté (PNG, JPEG, WEBP ou SVG uniquement).");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Le fichier dépasse 2 Mo.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const path = `${merchantId}/logo.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("logos").getPublicUrl(path);
    const newLogoUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("merchants")
      .update({ logo_url: newLogoUrl })
      .eq("id", merchantId);

    setIsUploading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setLogoUrl(newLogoUrl);
    setSuccess(true);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Logo"
            className="h-16 w-16 rounded-lg border border-neutral-200 object-contain"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-center text-xs text-neutral-400">
            Aucun logo
          </div>
        )}
        <div>
          <Button
            type="button"
            variant="secondary"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading
              ? "Envoi..."
              : logoUrl
                ? "Changer le logo"
                : "Ajouter un logo"}
          </Button>
          <p className="mt-1 text-xs text-neutral-500">
            PNG, JPEG, WEBP ou SVG, 2 Mo max.
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && <p className={`mt-2 ${errorClass}`}>{error}</p>}
      {success && <p className={`mt-2 ${successClass}`}>Logo mis à jour.</p>}
    </div>
  );
}
