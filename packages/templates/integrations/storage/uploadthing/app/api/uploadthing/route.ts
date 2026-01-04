import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply custom config
  config: {
    // Optional: customize the callback URL
    // callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/uploadthing`,

    // Optional: enable logging
    // logLevel: "debug",
  },
});

