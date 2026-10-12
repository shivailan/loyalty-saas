import { z } from "zod";

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide");

export const brandingSchema = z.object({
  primaryColor: color,
  secondaryColor: color,
});

export type BrandingInput = z.infer<typeof brandingSchema>;
