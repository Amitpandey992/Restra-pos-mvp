import { z } from "zod";
import { createTenantSchema } from "./tenant.validation";

export const registerTenantSchema = z.object({
  tenant: createTenantSchema,
  user: z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d+$/),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
});
