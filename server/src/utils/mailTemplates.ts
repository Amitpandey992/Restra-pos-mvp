export const getOtpTemplate = (otp: string, name: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
      <p style="font-size: 16px; color: #555;">Hi ${name},</p>
      <p style="font-size: 16px; color: #555;">Thank you for joining <strong>TastyBytes</strong>. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #F3F4F6; padding: 10px 20px; border-radius: 5px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">© 2026 TastyBytes Restaurant Management System. All rights reserved.</p>
    </div>
  `;
};
