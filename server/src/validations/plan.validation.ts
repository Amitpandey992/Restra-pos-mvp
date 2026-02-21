import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().min(0),
  duration_days: z.number().int().positive(),
  features: z.object({}).passthrough().optional(),
  is_active: z.boolean().optional(),
});
