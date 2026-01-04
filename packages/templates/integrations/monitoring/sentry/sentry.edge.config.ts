/**
 * Sentry Edge Configuration
 * 
 * Initializes Sentry for Edge runtime (middleware, edge routes).
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Debug mode for development
  debug: process.env.NODE_ENV === "development",

  // Filter out non-essential errors
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    return event;
  },

  // Environment
  environment: process.env.NODE_ENV,
});

