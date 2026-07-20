import { z } from "zod";

export const scanSchema = z.object({
  cardId: z.string().uuid("Code invalide"),
});

export type ScanInput = z.infer<typeof scanSchema>;
