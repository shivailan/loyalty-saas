"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { signup } from "./actions";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass } from "@/lib/ui";

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupInput) {
    setServerError(null);
    const result = await signup(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <AuthShell>
        <h1 className="text-xl font-semibold text-neutral-900">
          Vérifiez votre email
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Un email de confirmation vous a été envoyé. Cliquez sur le lien
          qu&apos;il contient pour activer votre compte, puis connectez-vous.
        </p>
        <Link
          className="mt-4 inline-block font-medium text-neutral-900 underline"
          href="/login"
        >
          Aller à la page de connexion
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-neutral-900">
        Créer votre compte commerçant
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label className={labelClass} htmlFor="businessName">
            Nom de l&apos;établissement
          </label>
          <input
            id="businessName"
            className={`mt-1 ${inputClass}`}
            {...register("businessName")}
          />
          {errors.businessName && (
            <p className={errorClass}>{errors.businessName.message}</p>
          )}
        </div>
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
        <div>
          <label className={labelClass} htmlFor="password">
            Mot de passe
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
        {serverError && <p className={errorClass}>{serverError}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        Déjà un compte ?{" "}
        <Link className="font-medium text-neutral-900 underline" href="/login">
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
