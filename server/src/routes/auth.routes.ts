import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validation";
import * as authValidation from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth";
import { otpLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post(
  "/register",
  validate(authValidation.registerTenantSchema),
  authController.registerTenant,
);
router.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.login,
);

router.post(
  "/verify-otp",
  otpLimiter,
  validate(authValidation.verifyOtpSchema),
  authController.verifyOtp,
);

router.post(
  "/resend-otp",
  otpLimiter,
  validate(authValidation.resendOtpSchema),
  authController.resendOtp,
);

router.get("/me", authenticate, authController.getMe);

export default router;
