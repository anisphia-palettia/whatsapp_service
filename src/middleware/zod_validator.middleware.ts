import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";

export default function zodValidator<T extends ZodType>(
  target: "json" | "form" | "query" | "param",
  schema: T
) {
  return zValidator(target, schema, (res, c) => {
    if (!res.success) {
      throw res.error;
    }
  });
}
