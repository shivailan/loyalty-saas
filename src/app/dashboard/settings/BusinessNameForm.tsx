"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessNameSchema,
  type BusinessNameInput,
} from "@/lib/validations/account";
import { updateBusinessName } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export function BusinessNameForm({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessNameInput>({
    resolver: zodResolver(businessNameSchema),
    defaultValues: { businessName: defaultValue },
  });

  async function onSubmit(data: BusinessNameInput) {
    setServerError(null);
    setSaved(false);
    const result = await updateBusinessName(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label className={labelClass} htmlFor="businessName">
        Nom de l&apos;établissement
      </label>
      <input
        id="businessName"
        className={inputClass}
        {...register("businessName")}
      />
      {errors.businessName && (
        <p className={errorClass}>{errors.businessName.message}</p>
      )}
      {serverError && <p className={errorClass}>{serverError}</p>}
      {saved && <p className={successClass}>Enregistré.</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
