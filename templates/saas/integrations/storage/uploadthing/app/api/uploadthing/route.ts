/**
 * UploadThing API Route Handler
 *
 * This creates the Next.js API routes for handling file uploads.
 * Mounted at /api/uploadthing
 */

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
  // Apply additional config
  config: {
    // Optional: Add callback URL for webhooks
    // callbackUrl: "https://your-domain.com/api/uploadthing",
    
    // Optional: Log upload details (useful for debugging)
    // logLevel: "debug",
  },
});

