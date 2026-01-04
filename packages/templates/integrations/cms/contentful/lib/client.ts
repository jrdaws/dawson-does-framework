import { createClient } from "contentful";

// Standard client for published content
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Preview client for draft content
export const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: "preview.contentful.com",
});

/**
 * Get the appropriate client based on preview mode
 */
export function getClient(preview = false) {
  return preview ? previewClient : contentfulClient;
}

/**
 * Helper to check if preview mode is enabled
 */
export function isPreviewMode() {
  return process.env.CONTENTFUL_PREVIEW_MODE === "true";
}

