import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const generateTokens = (user: any) => {
  const payload = {
    sub: user.id,
    role: user.Role?.name || "UNKNOWN", // Should be loaded via include
    tenantId: user.tenant_id,
    email: user.email,
  };

  // accessExpiration usually like '15m' or '1d'
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration as any,
  });

  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiration as any,
  });

  return { accessToken, refreshToken };
};
