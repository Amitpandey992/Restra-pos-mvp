import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { config } from "../config/config";

// Interface for what we expect in the token
export interface TokenPayload {
  sub: string;
  id: string;
  role: string;
  tenantId: string;
  email: string;
}

// Extend Express Request globally (making it optional because not all routes are authenticated)
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Specific type for routes that ARE authenticated
export interface AuthRequest extends Request {
  user: TokenPayload; // Required here
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.secret || "",
    ) as TokenPayload;
    req.user = {
      ...decoded,
      id: decoded.sub,
    };
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid Token"));
  }
};
