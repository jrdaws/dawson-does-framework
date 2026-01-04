/**
 * Sentry Utilities
 * 
 * Helper functions for error tracking and user context.
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
} | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string = "custom",
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}

/**
 * Capture a custom error
 */
export function captureError(
  error: Error,
  context?: Record<string, unknown>
) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message (non-error event)
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>
) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set custom tags for filtering
 */
export function setTags(tags: Record<string, string>) {
  for (const [key, value] of Object.entries(tags)) {
    Sentry.setTag(key, value);
  }
}

/**
 * Wrap async function with error handling
 */
export async function withSentry<T>(
  fn: () => Promise<T>,
  operation: string
): Promise<T> {
  return Sentry.startSpan({ name: operation }, async () => {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        captureError(error, { operation });
      }
      throw error;
    }
  });
}

