import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as paymentService from "../services/payment.service";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { email, planId } = req.body;
  const result = await paymentService.createRazorpayOrder(email, planId);
  res.status(200).json(new ApiResponse(200, result, "Order created successfully"));
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { email, planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const result = await paymentService.verifyPayment(
    email,
    planId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  
  res.status(200).json(new ApiResponse(200, result, "Payment verified successfully"));
});
