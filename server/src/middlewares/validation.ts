import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      let message = "Validation Error";
      let errors = [];

      if (error.errors) {
        errors = error.errors.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        message = errors.map((e: any) => `${e.field}: ${e.message}`).join(", ");
      }

      next(new ApiError(400, message, errors));
    }
  };
