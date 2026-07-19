import bcrypt from "bcryptjs";
import Otp from "../models/Otp";
import { ApiError } from "../utils/ApiError";
import * as mailService from "./mail.service";
import { getOtpTemplate } from "../utils/mailTemplates";
import User from "../models/User";

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 30;
const MAX_ATTEMPTS = 5;

export const generateOTP = async (email: string, userName: string) => {
  // 1. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // 2. Clear any existing OTP for this email
  await Otp.destroy({ where: { email } });

  // 3. Store new OTP
  await Otp.create({
    email,
    otp_hash: otpHash,
    expires_at: expiresAt,
    attempts: 0,
  });

  // 4. Send Email
  const template = getOtpTemplate(otp, userName);
  await mailService.sendEmail(email, "Your OTP for Restora", template);

  return true;
};

export const verifyOTP = async (email: string, otp: string) => {
  const otpRecord = await Otp.findOne({ where: { email } });

  if (!otpRecord) {
    throw new ApiError(404, "OTP not found or expired");
  }

  // 1. Check if expired
  if (new Date() > otpRecord.expires_at) {
    await Otp.destroy({ where: { email } });
    throw new ApiError(401, "OTP has expired");
  }

  // 2. Check attempts
  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    await Otp.destroy({ where: { email } });
    throw new ApiError(
      401,
      "Too many failed attempts. Please request a new OTP.",
    );
  }

  // 3. Verify OTP
  const isMatch = await otpRecord.isOtpMatch(otp);
  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new ApiError(
      401,
      `Invalid OTP. ${MAX_ATTEMPTS - otpRecord.attempts} attempts remaining.`,
    );
  }

  // 4. Success - Delete OTP record
  await Otp.destroy({ where: { email } });

  // 5. Update user status to verified
  const user = await User.findOne({ where: { email } });
  if (user) {
    user.is_verified = true;
    user.is_active = true;
    await user.save();
  }

  return true;
};

export const resendOTP = async (email: string) => {
  const otpRecord = await Otp.findOne({ where: { email } });

  if (otpRecord && otpRecord.last_resend_at) {
    const timeSinceLastResend =
      (Date.now() - new Date(otpRecord.last_resend_at).getTime()) / 1000;
    if (timeSinceLastResend < RESEND_COOLDOWN_SECONDS) {
      throw new ApiError(
        429,
        `Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - timeSinceLastResend)} seconds before resending.`,
      );
    }
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  // Generate new OTP
  await generateOTP(email, user.full_name);

  // Update last_resend_at
  const newRecord = await Otp.findOne({ where: { email } });
  if (newRecord) {
    newRecord.last_resend_at = new Date();
    await newRecord.save();
  }

  return true;
};
