"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/password-reset";
import { requestPasswordReset } from "./actions";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    await requestPasswordReset(data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthShell>
        <h1 className="text-xl font-semibold text-neutral-900">
          Vérifiez votre email
        </h1>
        <p className={`mt-2 ${successClass}`}>
          Si un compte existe avec cet email, vous recevrez un lien pour
          réinitialiser votre mot de passe.
        </p>
        <Link
          className="mt-4 inline-block font-medium text-neutral-900 underline"
          href="/login"
        >
          Retour à la connexion
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-neutral-900">
        Mot de passe oublié
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Entrez votre email, nous vous envoyons un lien pour le
        réinitialiser.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`mt-1 ${inputClass}`}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Envoi..." : "Envoyer le lien"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link className="font-medium text-neutral-900 underline" href="/login">
          Retour à la connexion
        </Link>
      </p>
    </AuthShell>
  );
}
