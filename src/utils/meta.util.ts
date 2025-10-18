import type { Context } from "hono";
import type { Meta } from "./api_response.util";

export const createMeta = (c: Context): Meta => {
  return {
    requestId: Bun.randomUUIDv7(),
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString(),
  };
};
