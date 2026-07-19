export const getOtpTemplate = (otp: string, name: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f6f8; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">TastyBytes</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 32px;">
          <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 22px; font-weight: 600;">Verify Your Email</h2>
          <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
            Hi <strong>${name}</strong>,<br><br>
            Thank you for joining <strong>TastyBytes</strong>. To complete your registration and secure your account, please use the following One-Time Password (OTP):
          </p>
          
          <!-- OTP Box -->
          <div style="text-align: center; margin: 36px 0;">
            <div style="display: inline-block; background-color: #eef2ff; border: 1px solid #c7d2fe; padding: 16px 32px; border-radius: 12px;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; display: block; margin-left: 8px;">${otp}</span>
            </div>
          </div>
          
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
            This code is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0;">
            If you did not request this verification, you can safely ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
          <p style="font-size: 13px; color: #64748b; margin: 0 0 8px;">
            © ${new Date().getFullYear()} TastyBytes Restaurant Management System.
          </p>
          <p style="font-size: 13px; color: #94a3b8; margin: 0;">
            All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
