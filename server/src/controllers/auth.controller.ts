import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as authService from "../services/auth.service";
import * as otpService from "../services/otp.service";

export const registerTenant = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.registerTenant(req.body.tenant, req.body.user);
    res
      .status(201)
      .json(new ApiResponse(201, result, "Company registered successfully"));
  },
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json(new ApiResponse(200, result, "Logged in successfully"));
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const user = await authService.getCurrentUser(userId);
  res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await otpService.verifyOTP(email, otp);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await otpService.resendOTP(email);
  res.status(200).json(new ApiResponse(200, null, "OTP resent successfully"));
});
