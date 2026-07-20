"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinSchema, type JoinInput } from "@/lib/validations/join";
import { joinLoyaltyProgram } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass } from "@/lib/ui";

export function JoinForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinInput>({ resolver: zodResolver(joinSchema) });

  async function onSubmit(data: JoinInput) {
    setServerError(null);
    const result = await joinLoyaltyProgram(slug, data);
    if (result.error || !result.cardId) {
      setServerError(result.error ?? "Une erreur est survenue.");
      return;
    }
    router.push(`/card/${result.cardId}`);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4"
    >
      <div>
        <label className={labelClass} htmlFor="firstName">
          Prénom
        </label>
        <input
          id="firstName"
          className={`mt-1 ${inputClass}`}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className={errorClass}>{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass} htmlFor="lastName">
          Nom
        </label>
        <input
          id="lastName"
          className={`mt-1 ${inputClass}`}
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className={errorClass}>{errors.lastName.message}</p>
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
        <label className={labelClass} htmlFor="phone">
          Téléphone (optionnel)
        </label>
        <input
          id="phone"
          type="tel"
          className={`mt-1 ${inputClass}`}
          {...register("phone")}
        />
      </div>
      {serverError && <p className={errorClass}>{serverError}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Création..." : "Créer ma carte de fidélité"}
      </Button>
    </form>
  );
}
