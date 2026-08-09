import { z } from "zod";

export const businessNameSchema = z.object({
  businessName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),
});

export type BusinessNameInput = z.infer<typeof businessNameSchema>;
