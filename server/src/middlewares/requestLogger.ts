import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;

  console.log("----------------------------------------");
  console.log(`[${timestamp}] Incoming Request: ${method} ${url}`);

  if (Object.keys(req.query).length > 0) {
    console.log("Query Params:", JSON.stringify(req.query, null, 2));
  }

  if (req.body && Object.keys(req.body).length > 0) {
    // Clone body to avoid mutating original request if we sanitize
    const bodyToLog = { ...req.body };

    // Sanitize sensitive fields
    const sensitiveFields = ["password", "token", "authorization", "secret"];
    sensitiveFields.forEach((field) => {
      if (field in bodyToLog) {
        bodyToLog[field] = "***REDACTED***";
      }
    });

    console.log("Request Body:", JSON.stringify(bodyToLog, null, 2));
  }

  console.log("----------------------------------------");
  next();
};
