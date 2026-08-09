"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/password-reset";
import { changePassword } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    setSaved(false);
    const result = await changePassword(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className={labelClass} htmlFor="password">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          type="password"
          className={`mt-1 ${inputClass}`}
          {...register("password")}
        />
        {errors.password && (
          <p className={errorClass}>{errors.password.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass} htmlFor="confirmPassword">
          Confirmez le mot de passe
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={`mt-1 ${inputClass}`}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className={errorClass}>{errors.confirmPassword.message}</p>
        )}
      </div>
      {serverError && <p className={errorClass}>{serverError}</p>}
      {saved && <p className={successClass}>Mot de passe mis à jour.</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Enregistrement..." : "Changer le mot de passe"}
      </Button>
    </form>
  );
}
