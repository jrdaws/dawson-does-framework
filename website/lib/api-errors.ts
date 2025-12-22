import { NextResponse } from "next/server";

/**
 * Standard error response structure following API_CONTRACTS.md
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    recovery?: string;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Standard success response structure following API_CONTRACTS.md
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Helper function to create standard error responses
 */
export function apiError(
  code: string,
  message: string,
  status: number,
  details?: unknown,
  recovery?: string,
  headers?: HeadersInit
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details, recovery },
      meta: { timestamp: new Date().toISOString() }
    },
    { status, headers }
  );
}

/**
 * Helper function to create standard success responses
 */
export function apiSuccess<T>(
  data: T,
  status: number = 200,
  headers?: HeadersInit
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString() }
    },
    { status, headers }
  );
}

/**
 * Common error codes as constants
 */
export const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_FIELD: "MISSING_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",
  INVALID_VALUE: "INVALID_VALUE",

  // Token errors
  TOKEN_INVALID: "TOKEN_INVALID",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  TOKEN_GENERATION_FAILED: "TOKEN_GENERATION_FAILED",

  // Rate limiting
  RATE_LIMITED: "RATE_LIMITED",

  // Database errors
  DATABASE_ERROR: "DATABASE_ERROR",

  // Generic errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
} as const;
