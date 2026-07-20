"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  retrieveCardSchema,
  type RetrieveCardInput,
} from "@/lib/validations/retrieve-card";
import { retrieveCard } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, errorClass, successClass } from "@/lib/ui";

export function RetrieveForm({ slug }: { slug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RetrieveCardInput>({ resolver: zodResolver(retrieveCardSchema) });

  async function onSubmit(data: RetrieveCardInput) {
    await retrieveCard(slug, data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={`mt-6 ${successClass}`}>
        Si un compte existe avec cet email, vous recevrez un email contenant
        le lien vers votre carte.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4"
    >
      <div>
        <label className={labelClass} htmlFor="email">
          Email utilisé lors de votre inscription
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
        {isSubmitting ? "Envoi..." : "Recevoir ma carte par email"}
      </Button>
    </form>
  );
}
