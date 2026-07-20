"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationSettingsSchema,
  type NotificationSettingsInput,
} from "@/lib/validations/notifications";
import { saveNotificationSettings } from "./actions";
import { Button } from "@/components/ui/Button";
import { successClass, errorClass } from "@/lib/ui";

export function NotificationsForm({
  defaultValues,
}: {
  defaultValues: NotificationSettingsInput;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NotificationSettingsInput>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues,
  });

  async function onSubmit(data: NotificationSettingsInput) {
    setServerError(null);
    setSaved(false);
    const result = await saveNotificationSettings(data);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400"
          {...register("sendWelcomeEmail")}
        />
        <span>
          <span className="block text-sm font-medium text-neutral-900">
            Email de bienvenue
          </span>
          <span className="block text-sm text-neutral-600">
            Envoyé au client à l&apos;inscription, avec le lien vers sa
            carte.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-yellow-500 focus:ring-yellow-400"
          {...register("sendRewardEmail")}
        />
        <span>
          <span className="block text-sm font-medium text-neutral-900">
            Email de récompense atteinte
          </span>
          <span className="block text-sm text-neutral-600">
            Envoyé dès que le client atteint le seuil de passages requis.
          </span>
        </span>
      </label>

      {serverError && <p className={errorClass}>{serverError}</p>}
      {saved && <p className={successClass}>Enregistré.</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
