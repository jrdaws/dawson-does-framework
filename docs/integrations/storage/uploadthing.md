# UploadThing Integration

> Type-safe file uploads for Next.js with UploadThing.

---

## Overview

UploadThing is a file upload service built specifically for Next.js applications. It provides:

- **Type-safe uploads** - Full TypeScript support with file router
- **Direct-to-storage** - Files go directly to cloud storage (no server memory)
- **Progress tracking** - Built-in upload progress indicators
- **React components** - Pre-built upload button and dropzone
- **Generous free tier** - 2GB/month free for development

---

## Setup

### 1. Get API Token

1. Create an account at [uploadthing.com](https://uploadthing.com)
2. Create a new app in the dashboard
3. Copy your API token

### 2. Add Environment Variable

```bash
# .env.local
UPLOADTHING_TOKEN=your_token_here
```

### 3. Install Dependencies

Dependencies are automatically added when you export with the storage integration:

```bash
framework export saas ./my-app --storage uploadthing
```

Or install manually:

```bash
npm install uploadthing @uploadthing/react
```

---

## Usage

### Upload Button

Simple button that triggers file selection:

```tsx
import { StorageUploadButton } from "@/components/storage";

export function MyComponent() {
  return (
    <StorageUploadButton
      endpoint="imageUploader"
      onUploadComplete={(files) => {
        console.log("Uploaded:", files);
        // files = [{ url, name, size }]
      }}
      onUploadError={(error) => {
        console.error("Upload failed:", error);
      }}
    />
  );
}
```

### Upload Dropzone

Drag-and-drop area for file uploads:

```tsx
import { StorageUploadDropzone } from "@/components/storage";

export function MyComponent() {
  return (
    <StorageUploadDropzone
      endpoint="imageUploader"
      onUploadComplete={(files) => {
        console.log("Uploaded:", files);
      }}
    />
  );
}
```

### File Preview

Display uploaded files with preview and remove functionality:

```tsx
import { FilePreview } from "@/components/storage";
import { useState } from "react";

export function MyComponent() {
  const [files, setFiles] = useState([]);

  return (
    <>
      <StorageUploadButton
        endpoint="imageUploader"
        onUploadComplete={(newFiles) => {
          setFiles((prev) => [...prev, ...newFiles]);
        }}
      />
      
      <FilePreview
        files={files}
        onRemove={(file) => {
          setFiles((prev) => prev.filter((f) => f.url !== file.url));
        }}
      />
    </>
  );
}
```

---

## Available Endpoints

The integration includes pre-configured upload endpoints:

| Endpoint | File Types | Max Size | Max Files |
|----------|------------|----------|-----------|
| `imageUploader` | jpg, png, gif, webp | 4MB | 4 |
| `documentUploader` | pdf, doc, docx | 16MB | 1 |
| `avatarUploader` | jpg, png, gif, webp | 2MB | 1 |
| `videoUploader` | mp4, mov, webm | 64MB | 1 |

### Custom Endpoints

Add custom endpoints in `lib/uploadthing.ts`:

```typescript
export const ourFileRouter = {
  // Existing endpoints...

  // Custom endpoint for audio files
  audioUploader: f({
    audio: {
      maxFileSize: "32MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      // Add authentication here
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, name: file.name };
    }),
} satisfies FileRouter;
```

---

## Authentication

Add authentication to uploads in the middleware:

```typescript
import { auth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // Get user from Clerk
      const { userId } = await auth();
      
      // Reject if not authenticated
      if (!userId) throw new UploadThingError("Unauthorized");
      
      // Pass user ID to onUploadComplete
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // metadata.userId is available here
      console.log("User", metadata.userId, "uploaded", file.name);
      
      // Save to database
      // await db.files.create({ userId: metadata.userId, url: file.url });
      
      return { url: file.url };
    }),
};
```

---

## Utility Functions

The integration includes helpful utilities:

```typescript
import {
  formatFileSize,
  isAllowedFileType,
  isWithinSizeLimit,
  generateUniqueFilename,
  getFileExtension,
  isUploadThingUrl,
} from "@/lib/uploadthing";

// Format bytes to human-readable size
formatFileSize(1024 * 1024); // "1 MB"

// Check file type
isAllowedFileType(file, ["image/*", "application/pdf"]); // true/false

// Check file size
isWithinSizeLimit(file, 4); // 4MB limit, true/false

// Generate unique filename
generateUniqueFilename("photo.jpg"); // "photo-1704567890123-abc123.jpg"

// Get file extension
getFileExtension("document.pdf"); // "pdf"

// Check if URL is from UploadThing
isUploadThingUrl("https://utfs.io/f/abc123.jpg"); // true
```

---

## Styling

### Custom Button Styling

```tsx
<StorageUploadButton
  endpoint="imageUploader"
  className="bg-green-600 hover:bg-green-700"
  buttonText="Upload Photo"
/>
```

### Custom Dropzone Styling

```tsx
<StorageUploadDropzone
  endpoint="imageUploader"
  className="border-blue-400 bg-blue-50"
/>
```

---

## Error Handling

```tsx
<StorageUploadButton
  endpoint="imageUploader"
  onUploadError={(error) => {
    // Common errors:
    // - "Unauthorized" - Authentication failed
    // - "File too large" - Exceeds max size
    // - "Invalid file type" - Type not allowed
    
    if (error.message.includes("Unauthorized")) {
      alert("Please sign in to upload files");
    } else {
      alert(`Upload failed: ${error.message}`);
    }
  }}
/>
```

---

## Best Practices

### 1. Always Authenticate Uploads

Don't allow anonymous uploads in production:

```typescript
.middleware(async () => {
  const { userId } = await auth();
  if (!userId) throw new UploadThingError("Unauthorized");
  return { userId };
})
```

### 2. Store References in Database

After upload, save the URL to your database:

```typescript
.onUploadComplete(async ({ metadata, file }) => {
  await db.files.create({
    userId: metadata.userId,
    url: file.url,
    name: file.name,
    size: file.size,
  });
})
```

### 3. Handle Upload States

Show loading and error states:

```tsx
const [uploading, setUploading] = useState(false);
const [error, setError] = useState<string | null>(null);

<StorageUploadButton
  endpoint="imageUploader"
  onUploadBegin={() => {
    setUploading(true);
    setError(null);
  }}
  onUploadComplete={() => setUploading(false)}
  onUploadError={(err) => {
    setUploading(false);
    setError(err.message);
  }}
/>
{uploading && <p>Uploading...</p>}
{error && <p className="text-red-500">{error}</p>}
```

---

## Troubleshooting

### "UPLOADTHING_TOKEN not configured"

Make sure your `.env.local` file contains:
```bash
UPLOADTHING_TOKEN=your_token_here
```

Then restart your development server.

### "Unauthorized" errors

Check that your middleware is returning a valid user:
```typescript
.middleware(async () => {
  const { userId } = await auth();
  console.log("User ID:", userId); // Debug
  if (!userId) throw new UploadThingError("Unauthorized");
  return { userId };
})
```

### Files not appearing

Verify the upload completed successfully:
```typescript
onUploadComplete={(files) => {
  console.log("Uploaded files:", files);
  // Check the URL is valid
}}
```

---

## Resources

- [UploadThing Documentation](https://docs.uploadthing.com)
- [UploadThing Dashboard](https://uploadthing.com/dashboard)
- [Next.js App Router Guide](https://docs.uploadthing.com/getting-started/appdir)

---

*This integration is maintained by the Integration Agent.*
