"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brandingSchema,
  type BrandingInput,
} from "@/lib/validations/branding";
import { saveBrandingColor } from "./actions";
import { Button } from "@/components/ui/Button";
import { labelClass, errorClass, successClass } from "@/lib/ui";

export function ColorForm({ defaultColor }: { defaultColor: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<BrandingInput>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { primaryColor: defaultColor },
  });

  const currentColor = watch("primaryColor");

  async function onSubmit(data: BrandingInput) {
    setServerError(null);
    setSaved(false);
    const result = await saveBrandingColor(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label className={labelClass} htmlFor="primaryColor">
        Couleur principale
      </label>
      <div className="flex items-center gap-3">
        <input
          id="primaryColor"
          type="color"
          className="h-10 w-14 cursor-pointer rounded border border-neutral-300"
          {...register("primaryColor")}
        />
        <span className="text-sm text-neutral-600">{currentColor}</span>
      </div>
      {serverError && <p className={errorClass}>{serverError}</p>}
      {saved && <p className={successClass}>Enregistré.</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Enregistrement..." : "Enregistrer la couleur"}
      </Button>
    </form>
  );
}
