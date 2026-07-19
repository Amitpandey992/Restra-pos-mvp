import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: { parse: (data: any) => any }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      let message = "Validation Error";
      let errors: any[] = [];

      // Zod throws an error object that contains an 'issues' array (or 'errors' array)
      const zodIssues = error.issues || error.errors;
      if (Array.isArray(zodIssues)) {
        errors = zodIssues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        message = errors.map((e: any) => `${e.field}: ${e.message}`).join(", ");
      } else {
        message = error.message || message;
      }

      next(new ApiError(400, message, errors));
    }
  };
