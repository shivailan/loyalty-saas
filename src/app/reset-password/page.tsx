"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/password-reset";
import { updatePassword } from "./actions";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    const result = await updatePassword(data);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-neutral-900">
        Nouveau mot de passe
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
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
        {success && (
          <p className={successClass}>
            Mot de passe mis à jour. Redirection...
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </AuthShell>
  );
}
