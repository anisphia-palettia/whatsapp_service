import type { NotFoundHandler } from "hono";
import { errorResponse } from "../utils/api_response.util";

export const notFoundHandler: NotFoundHandler = (c) => {
  return errorResponse(c, {
    message: "Page not found",
    error: c.error,
    status: 404,
  });
};
