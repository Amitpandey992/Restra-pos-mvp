import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().optional(),
  phone: z.string().optional(),
  plan_id: z.string().uuid("Plan ID must be a valid UUID").optional(),
  settings: z.object({}).passthrough().optional(),
});
