import razorpay from "../config/razorpay";
import crypto from "crypto";
import Plan from "../models/Plan";
import User from "../models/User";
import Tenant from "../models/Tenant";
import { ApiError } from "../utils/ApiError";
import sequelize from "../config/database";

export const createRazorpayOrder = async (email: string, planId: string) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Tenant }],
  });
  if (!user || !user.tenant_id) {
    throw new ApiError(404, "User or Tenant not found for this email");
  }

  const plan = await Plan.findByPk(planId);
  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const options = {
    amount: Math.round(plan.price * 100), // amount in smallest currency unit (paise)
    currency: "INR",
    // Razorpay receipt max length is 40 chars. UUID is 36, so we truncate it.
    receipt: `rcpt_${user.tenant_id.substring(0, 8)}_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name,
      planId: plan.id,
      restaurantName: user.Tenant?.name,
    };
  } catch (error: any) {
    console.error("Razorpay error:", error);
    throw new ApiError(500, `Failed to create Razorpay order: ${error.message || JSON.stringify(error)}`);
  }
};

export const verifyPayment = async (
  email: string,
  planId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.tenant_id) {
    throw new ApiError(404, "User or Tenant not found");
  }

  const plan = await Plan.findByPk(planId);
  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new ApiError(500, "Razorpay secret key is not configured");
  }

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // Update tenant subscription
  const transaction = await sequelize.transaction();
  try {
    const tenant = await Tenant.findByPk(user.tenant_id);
    if (!tenant) throw new ApiError(404, "Tenant not found");

    tenant.plan_id = plan.id;
    tenant.is_active = true;

    // Add plan duration to current date, or extend existing active subscription
    const currentDate = new Date();
    tenant.subscription_end_date = new Date(
      currentDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000,
    );

    await tenant.save({ transaction });
    await transaction.commit();

    return { success: true, message: "Payment verified successfully" };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(500, "Failed to update tenant subscription");
  }
};
