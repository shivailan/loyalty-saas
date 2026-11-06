"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  notificationSettingsSchema,
  type NotificationSettingsInput,
} from "@/lib/validations/notifications";

export async function saveNotificationSettings(
  input: NotificationSettingsInput,
): Promise<{ error: string | null }> {
  const parsed = notificationSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { error } = await supabase
    .from("merchants")
    .update({
      send_welcome_email: parsed.data.sendWelcomeEmail,
      send_reward_email: parsed.data.sendRewardEmail,
    })
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/notifications");
  return { error: null };
}
