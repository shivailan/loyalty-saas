import { z } from "zod";

export const brandingSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
});

export type BrandingInput = z.infer<typeof brandingSchema>;
