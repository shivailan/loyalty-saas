import { z } from "zod";

export const loyaltyProgramSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  visitsRequired: z
    .number()
    .int("Doit être un nombre entier")
    .min(1, "Il faut au moins 1 passage")
    .max(100, "100 passages maximum"),
  rewardDescription: z
    .string()
    .min(3, "Décrivez la récompense (au moins 3 caractères)"),
  isActive: z.boolean(),
});

export type LoyaltyProgramInput = z.infer<typeof loyaltyProgramSchema>;
