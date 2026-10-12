"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brandingSchema,
  type BrandingInput,
} from "@/lib/validations/branding";
import { saveBrandingColors } from "./actions";
import { cardColors, contrastRatio } from "@/lib/card-colors";
import { Button } from "@/components/ui/Button";
import { labelClass, errorClass, successClass } from "@/lib/ui";

export function ColorForm({
  merchantName,
  logoUrl,
  defaultPrimary,
  defaultSecondary,
}: {
  merchantName: string;
  logoUrl: string | null;
  defaultPrimary: string;
  defaultSecondary: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<BrandingInput>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: defaultPrimary,
      secondaryColor: defaultSecondary,
    },
  });

  const primary = watch("primaryColor");
  const secondary = watch("secondaryColor");
  const { background, text } = cardColors(primary, secondary);
  const readable = contrastRatio(primary, secondary) >= 3;

  async function onSubmit(data: BrandingInput) {
    setServerError(null);
    setSaved(false);
    const result = await saveBrandingColors(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="primaryColor">
            Couleur principale
          </label>
          <p className="mt-0.5 text-xs text-neutral-500">Le fond de la carte.</p>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="primaryColor"
              type="color"
              className="h-10 w-14 cursor-pointer rounded border border-neutral-300"
              {...register("primaryColor")}
            />
            <span className="text-sm text-neutral-600">{primary}</span>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="secondaryColor">
            Couleur secondaire
          </label>
          <p className="mt-0.5 text-xs text-neutral-500">
            Les textes et la barre de progression.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="secondaryColor"
              type="color"
              className="h-10 w-14 cursor-pointer rounded border border-neutral-300"
              {...register("secondaryColor")}
            />
            <span className="text-sm text-neutral-600">{secondary}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Aperçu de la carte
        </p>
        <div
          className="mt-2 rounded-2xl p-5 shadow-sm"
          style={{ backgroundColor: background, color: text }}
        >
          <div className="flex items-center gap-3">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-10 w-10 rounded-lg bg-white/80 object-contain p-1"
              />
            )}
            <p className="text-lg font-semibold">{merchantName.trim()}</p>
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-wide opacity-80">
            Passages
          </p>
          <p className="text-2xl font-bold">4 sur 10</p>
          <div
            className="mt-3 h-2.5 w-full rounded-full"
            style={{ backgroundColor: `${text}33` }}
          >
            <div
              className="h-2.5 rounded-full"
              style={{ width: "40%", backgroundColor: text }}
            />
          </div>
        </div>
        {!readable && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Ces deux couleurs sont trop proches : le texte serait difficile à
            lire. Sur la carte de vos clients, le texte sera automatiquement
            affiché en noir ou en blanc. Choisissez des couleurs plus
            contrastées pour garder votre identité.
          </p>
        )}
      </div>

      {serverError && <p className={errorClass}>{serverError}</p>}
      {saved && <p className={successClass}>Enregistré.</p>}
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Enregistrement..." : "Enregistrer les couleurs"}
      </Button>
    </form>
  );
}
