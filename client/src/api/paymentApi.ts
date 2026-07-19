import apiClient from "./apiClient";

export const createRazorpayOrder = async (email: string, planId: string) => {
  return await apiClient.post("/payments/create-order", { email, planId });
};

export const verifyPayment = async (paymentData: {
  email: string;
  planId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return await apiClient.post("/payments/verify-payment", paymentData);
};
