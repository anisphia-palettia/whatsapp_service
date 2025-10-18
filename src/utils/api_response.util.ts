import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { createMeta } from "./meta.util";

/**
 * Meta information for API responses
 */
export interface Meta {
  requestId?: string;
  path?: string;
  method?: string;
  timestamp?: string;
  page?: number;
  perPage?: number;
  total?: number;
  lastPage?: number;
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
  meta?: Meta;
  token?: string;
}

/**
 * Helper to send successful API responses
 */
export const successResponse = <T>(
  c: Context,
  {
    message,
    data,
    meta,
    token,
    status = 200,
  }: {
    message: string;
    data?: T;
    meta?: Meta;
    token?: string;
    status?: ContentfulStatusCode;
  }
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(token ? { token } : {}),
    meta: { ...createMeta(c), ...meta },
  };

  return c.json(response, status);
};

/**
 * Helper to send error API responses
 */
export const errorResponse = (
  c: Context,
  {
    message,
    error,
    meta,
    status = 500,
  }: {
    message: string;
    error?: unknown;
    meta?: Record<string, unknown>;
    status?: ContentfulStatusCode;
  }
) => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error ? { error } : {}),
    meta: { ...createMeta(c), ...meta },
  };

  return c.json(response, status);
};
