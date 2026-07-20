import { z } from "zod";

export const notificationSettingsSchema = z.object({
  sendWelcomeEmail: z.boolean(),
  sendRewardEmail: z.boolean(),
});

export type NotificationSettingsInput = z.infer<
  typeof notificationSettingsSchema
>;
