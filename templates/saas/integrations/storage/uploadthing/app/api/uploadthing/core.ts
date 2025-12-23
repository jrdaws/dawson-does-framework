/**
 * UploadThing File Router
 *
 * Define your file upload endpoints here.
 * Each endpoint specifies allowed file types, max size, and middleware.
 */

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * Authentication middleware - customize based on your auth provider
 * Returns user info to associate with uploads
 */
async function auth(req: Request) {
  // TODO: Replace with your actual auth logic
  // Example with Clerk: const { userId } = auth();
  // Example with Supabase: const { data: { user } } = await supabase.auth.getUser();
  
  // For demo, we'll use a placeholder
  // In production, return null if not authenticated
  return { userId: "demo-user" };
}

/**
 * File Router - defines all upload endpoints
 */
export const ourFileRouter = {
  /**
   * Image Uploader
   * - Max 4MB per image
   * - Up to 4 images at once
   * - Accepts jpeg, png, gif, webp
   */
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      
      // If no user, throw to reject the upload
      if (!user) throw new UploadThingError("Unauthorized");
      
      // Return user data to use in onUploadComplete
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Return data to client
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  /**
   * Document Uploader
   * - Max 16MB for PDFs
   * - Single file at a time
   */
  documentUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document uploaded:", file.name);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  /**
   * Avatar Uploader
   * - Single image, max 2MB
   * - For profile pictures
   */
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar updated for:", metadata.userId);
      // TODO: Update user profile with new avatar URL
      return { uploadedBy: metadata.userId, avatarUrl: file.url };
    }),

  /**
   * General File Uploader
   * - Max 32MB
   * - Common file types
   */
  fileUploader: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "16MB" },
    text: { maxFileSize: "1MB" },
    blob: { maxFileSize: "32MB" },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

