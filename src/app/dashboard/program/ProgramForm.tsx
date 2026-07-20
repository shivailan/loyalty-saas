"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loyaltyProgramSchema,
  type LoyaltyProgramInput,
} from "@/lib/validations/loyalty-program";
import { saveProgram } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export function ProgramForm({
  defaultValues,
}: {
  defaultValues: LoyaltyProgramInput;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoyaltyProgramInput>({
    resolver: zodResolver(loyaltyProgramSchema),
    defaultValues,
  });

  async function onSubmit(data: LoyaltyProgramInput) {
    setServerError(null);
    setSaved(false);
    const result = await saveProgram(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={labelClass} htmlFor="name">
          Nom du programme
        </label>
        <input
          id="name"
          className={`mt-1 ${inputClass}`}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>
      <div>
        <label className={labelClass} htmlFor="visitsRequired">
          Nombre de passages requis
        </label>
        <input
          id="visitsRequired"
          type="number"
          className={`mt-1 ${inputClass}`}
          {...register("visitsRequired", { valueAsNumber: true })}
        />
        {errors.visitsRequired && (
          <p className={errorClass}>{errors.visitsRequired.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass} htmlFor="rewardDescription">
          Récompense offerte
        </label>
        <input
          id="rewardDescription"
          placeholder="Ex : une boisson offerte"
          className={`mt-1 ${inputClass}`}
          {...register("rewardDescription")}
        />
        {errors.rewardDescription && (
          <p className={errorClass}>{errors.rewardDescription.message}</p>
        )}
      </div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400"
          {...register("isActive")}
        />
        <span>
          <span className="block text-sm font-medium text-neutral-900">
            Programme actif
          </span>
          <span className="block text-sm text-neutral-600">
            Désactivez pour suspendre temporairement les nouvelles
            inscriptions et les scans, sans rien supprimer.
          </span>
        </span>
      </label>
      {serverError && <p className={errorClass}>{serverError}</p>}
      {saved && <p className={successClass}>Enregistré.</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
