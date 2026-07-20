import { z } from "zod";

export const retrieveCardSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type RetrieveCardInput = z.infer<typeof retrieveCardSchema>;
