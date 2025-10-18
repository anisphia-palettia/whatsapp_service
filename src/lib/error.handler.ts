import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { errorResponse } from "../utils/api_response.util";
import { envConfig } from "../config/env.config";
import z, { ZodError } from "zod";

export const errorhandler: ErrorHandler = (err, c) => {
  const isProd = envConfig.NODE_ENV === "dev";
  if (err instanceof HTTPException) {
    return errorResponse(c, {
      message: err.message,
      error: isProd ? err : undefined,
      status: err.status,
    });
  } else if (err instanceof ZodError) {
    return errorResponse(c, {
      message: "Validation error",
      error: z.flattenError(err),
    });
  }

  return errorResponse(c, {
    message: "Internal Server Error",
    error: isProd ? err : undefined,
    status: 500,
  });
};
