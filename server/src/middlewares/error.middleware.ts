import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = error.errors.map((e: any) => e.message);
    const message = messages.join(", ");
    error = new ApiError(400, message, error.errors, error.stack);
  } else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], error.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  console.error("❌ Error:", {
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(error.statusCode).json(response);
};
