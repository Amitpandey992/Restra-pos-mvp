import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * A wrapper for asynchronous request handlers that catches any errors and forwards them to the next middleware.
 * Supports custom request types via generics.
 */
const asyncHandler = <T extends Request = Request>(
  requestHandler: (req: T, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req as T, res, next)).catch((err) =>
      next(err),
    );
  };
};

export { asyncHandler };
