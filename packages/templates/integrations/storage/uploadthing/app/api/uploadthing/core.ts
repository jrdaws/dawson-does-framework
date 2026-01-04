import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Fake auth function - replace with your auth logic
const auth = async (req: Request) => {
  // In a real app, validate the user's session here
  // For example with Supabase:
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  // return user
  return { id: "user-id" };
};

// FileRouter for your app, define as many endpoints as you need
export const ourFileRouter = {
  // Image uploader - max 4MB, up to 4 images
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return data to the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Document uploader - max 16MB
  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    text: { maxFileSize: "1MB" },
    "application/msword": { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "16MB",
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document uploaded:", file.name);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Avatar uploader - single image, max 2MB
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // You might want to update the user's avatar URL here
      console.log("Avatar uploaded for user:", metadata.userId);
      return { avatarUrl: file.url };
    }),

  // General file uploader - max 32MB
  fileUploader: f({ blob: { maxFileSize: "32MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

