"use client";

/**
 * Global Error Handler
 * 
 * Catches and reports errors at the root level.
 * Provides a fallback UI when the app crashes.
 */

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-gray-600">
                We apologize for the inconvenience. Our team has been notified.
              </p>
              {error.digest && (
                <p className="mt-2 text-sm text-gray-400">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

