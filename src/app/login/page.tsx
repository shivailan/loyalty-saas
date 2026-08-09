"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "./actions";
import { AuthShell } from "@/components/ui/AuthShell";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass } from "@/lib/ui";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await login(data);
    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-neutral-900">Connexion</h1>
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
          <Link
            href="/forgot-password"
            className="mt-1 inline-block text-xs font-medium text-neutral-500 underline hover:text-neutral-700"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        {serverError && <p className={errorClass}>{serverError}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        Pas encore de compte ?{" "}
        <Link className="font-medium text-neutral-900 underline" href="/signup">
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
