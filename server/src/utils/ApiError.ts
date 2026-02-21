class ApiError extends Error {
  statusCode: number;
  errors: any[];
  data: any;
  success: boolean;

  constructor(
    statusCode = 500,
    message = "Something went wrong",
    errors: any[] = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
