import { z } from "zod";

export const retrieveCardSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  // Champ piège invisible : un humain ne le remplit jamais, un robot oui.
  website: z.string().optional(),
});

export type RetrieveCardInput = z.infer<typeof retrieveCardSchema>;
