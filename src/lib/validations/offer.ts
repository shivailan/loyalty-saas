import { z } from "zod";

export const OFFER_MAX_LENGTH = 100;

export const offerSchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, "Le message doit contenir au moins 3 caractères")
    .max(
      OFFER_MAX_LENGTH,
      `Le message ne peut pas dépasser ${OFFER_MAX_LENGTH} caractères`,
    ),
});

export type OfferInput = z.infer<typeof offerSchema>;
