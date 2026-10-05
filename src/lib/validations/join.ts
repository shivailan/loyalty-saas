import { z } from "zod";

export const joinSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional().or(z.literal("")),
  marketingConsent: z.boolean(),
  // Champ piège invisible : un humain ne le remplit jamais, un robot oui.
  website: z.string().optional(),
});

export type JoinInput = z.infer<typeof joinSchema>;
