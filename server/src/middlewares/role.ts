import { NextFunction, Response, Request } from "express";
import { ApiError } from "../utils/ApiError";

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: Insufficient privileges"));
    }
    next();
  };
};
