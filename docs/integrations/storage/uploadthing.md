# UploadThing Integration

Type-safe file uploads for Next.js with built-in security, CDN delivery, and excellent developer experience.

## Overview

| Feature | Details |
|---------|---------|
| **Provider** | [UploadThing](https://uploadthing.com) |
| **Type** | Storage |
| **Best For** | Type-safe uploads, quick setup, SaaS apps |
| **Free Tier** | 2GB storage, 2GB bandwidth/month |

## Why UploadThing?

✅ **Type-safe** - Full TypeScript support with generated types  
✅ **Simple setup** - No S3 configuration needed  
✅ **Built-in CDN** - Files served globally via CDN  
✅ **Secure** - Signed URLs, middleware authentication  
✅ **React components** - Pre-built upload button and dropzone  
✅ **Next.js native** - Works seamlessly with App Router  
✅ **Generous free tier** - 2GB storage to start  

## Quick Start

### 1. Get Your API Token

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create an account and new app
3. Copy your API token from the dashboard

### 2. Add Environment Variable

```bash
# .env.local
UPLOADTHING_TOKEN=your_token_here
```

### 3. Install Dependencies

The integration includes these dependencies:
- `uploadthing` - Core library
- `@uploadthing/react` - React components and hooks

### 4. Use the Upload Component

```tsx
import { FileUpload } from "@/components/storage/file-upload";

export default function Page() {
  return (
    <FileUpload
      endpoint="imageUploader"
      onUploadComplete={(files) => {
        console.log("Uploaded:", files);
      }}
    />
  );
}
```

## File Structure

```
integrations/storage/uploadthing/
├── integration.json          # Integration metadata
├── package.json              # Dependencies
├── lib/
│   └── uploadthing.ts        # Core exports and utilities
├── app/
│   └── api/
│       └── uploadthing/
│           ├── core.ts       # File router definitions
│           └── route.ts      # API route handler
└── components/
    └── storage/
        └── file-upload.tsx   # Upload components
```

## Available Endpoints

The integration includes 4 pre-configured upload endpoints:

| Endpoint | Max Size | Max Files | Use Case |
|----------|----------|-----------|----------|
| `imageUploader` | 4MB | 4 | Gallery, product images |
| `documentUploader` | 16MB | 1 | PDFs, documents |
| `avatarUploader` | 2MB | 1 | Profile pictures |
| `fileUploader` | 32MB | 1 | General files |

## Components

### FileUpload

Full-featured upload component with drag-and-drop:

```tsx
import { FileUpload } from "@/components/storage/file-upload";

<FileUpload
  endpoint="imageUploader"          // Required: upload endpoint
  onUploadComplete={(files) => {}}  // Callback on success
  onUploadError={(error) => {}}     // Callback on error
  maxFiles={4}                      // Max files to accept
  accept="image/*"                  // Accepted file types
  disabled={false}                  // Disable uploads
/>
```

### ImageUploadPreview

Simple image upload with preview:

```tsx
import { ImageUploadPreview } from "@/components/storage/file-upload";

<ImageUploadPreview
  endpoint="avatarUploader"
  onUploadComplete={(url) => {
    // Save URL to user profile
    updateUser({ avatarUrl: url });
  }}
/>
```

### Pre-built Button and Dropzone

```tsx
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

// Simple button
<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => console.log("Files:", res)}
  onUploadError={(error) => alert(error.message)}
/>

// Drag-and-drop zone
<UploadDropzone
  endpoint="fileUploader"
  onClientUploadComplete={(res) => console.log("Files:", res)}
/>
```

## Custom File Router

Define custom upload endpoints in `app/api/uploadthing/core.ts`:

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Custom endpoint for video uploads
  videoUploader: f({ video: { maxFileSize: "256MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Add authentication
      const user = await getUser(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Process uploaded video
      await saveVideoToDatabase(metadata.userId, file);
      return { url: file.url };
    }),
} satisfies FileRouter;
```

## Authentication

Add authentication in the middleware:

### With Supabase

```typescript
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

.middleware(async ({ req }) => {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new UploadThingError("Unauthorized");
  
  return { userId: user.id };
})
```

### With Clerk

```typescript
import { auth } from "@clerk/nextjs";

.middleware(async ({ req }) => {
  const { userId } = auth();
  
  if (!userId) throw new UploadThingError("Unauthorized");
  
  return { userId };
})
```

## Using Uploaded Files

### Get File URL

```typescript
onUploadComplete={(files) => {
  const fileUrl = files[0].url;
  // Use the URL in your app
}}
```

### Save to Database

```typescript
import { db } from "@/lib/db";

.onUploadComplete(async ({ metadata, file }) => {
  await db.file.create({
    data: {
      userId: metadata.userId,
      url: file.url,
      name: file.name,
      size: file.size,
    }
  });
})
```

### Display Image

```tsx
<img src={uploadedFile.url} alt={uploadedFile.name} />
```

## Hooks

### useUploadThing

For custom upload implementations:

```tsx
import { useUploadThing } from "@/lib/uploadthing";

function CustomUploader() {
  const { startUpload, isUploading, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (files) => {
      console.log("Upload complete:", files);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
    onUploadProgress: (progress) => {
      console.log(`Progress: ${progress}%`);
    },
  });

  const handleUpload = async (files: File[]) => {
    await startUpload(files);
  };

  return (
    <button onClick={() => fileInputRef.current?.click()}>
      {isUploading ? "Uploading..." : "Upload"}
    </button>
  );
}
```

## Common Patterns

### Avatar Upload Form

```tsx
"use client";

import { ImageUploadPreview } from "@/components/storage/file-upload";
import { useState } from "react";

export function AvatarForm() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleSave = async () => {
    if (!avatarUrl) return;
    
    await fetch("/api/user/avatar", {
      method: "POST",
      body: JSON.stringify({ avatarUrl }),
    });
  };

  return (
    <div>
      <ImageUploadPreview
        endpoint="avatarUploader"
        onUploadComplete={setAvatarUrl}
      />
      <button onClick={handleSave} disabled={!avatarUrl}>
        Save Avatar
      </button>
    </div>
  );
}
```

### Multi-file Gallery

```tsx
"use client";

import { FileUpload } from "@/components/storage/file-upload";
import { useState } from "react";

export function GalleryUpload() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div>
      <FileUpload
        endpoint="imageUploader"
        maxFiles={4}
        onUploadComplete={(files) => {
          setImages((prev) => [...prev, ...files.map(f => f.url)]);
        }}
      />
      
      <div className="grid grid-cols-4 gap-4 mt-4">
        {images.map((url, i) => (
          <img key={i} src={url} className="rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

```tsx
<FileUpload
  endpoint="imageUploader"
  onUploadError={(error) => {
    if (error.message.includes("too large")) {
      alert("File is too large. Maximum size is 4MB.");
    } else if (error.message.includes("Unauthorized")) {
      alert("Please sign in to upload files.");
    } else {
      alert("Upload failed. Please try again.");
    }
  }}
/>
```

## Pricing

| Plan | Storage | Bandwidth | Price |
|------|---------|-----------|-------|
| Free | 2GB | 2GB/month | $0 |
| Pro | 100GB | 100GB/month | $25/month |
| Enterprise | Unlimited | Unlimited | Custom |

## Resources

- [UploadThing Documentation](https://docs.uploadthing.com)
- [API Reference](https://docs.uploadthing.com/api-reference)
- [Examples](https://github.com/uploadthing/uploadthing/tree/main/examples)
- [Discord Community](https://discord.gg/uploadthing)

## Troubleshooting

### "UPLOADTHING_TOKEN is not set"

Add the token to your `.env.local` file:
```bash
UPLOADTHING_TOKEN=your_token_here
```

### "Unauthorized" Error

Ensure your middleware returns user data:
```typescript
.middleware(async ({ req }) => {
  const user = await getUser(req);
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id }; // Must return metadata
})
```

### File Type Not Accepted

Check the endpoint configuration in `core.ts`. Add the file type:
```typescript
f({ image: {}, pdf: {}, blob: {} }) // Add more types
```

### Uploads Failing in Production

Verify your production environment has the `UPLOADTHING_TOKEN` set correctly.

## Comparison with Other Storage Options

| Feature | UploadThing | Supabase Storage | AWS S3 |
|---------|-------------|------------------|--------|
| Setup Time | Minutes | Minutes | Hours |
| Type Safety | ✅ Full | ⚠️ Partial | ❌ Manual |
| Free Tier | 2GB | 1GB | None |
| CDN Included | ✅ Yes | ✅ Yes | Extra cost |
| React Components | ✅ Built-in | ❌ Manual | ❌ Manual |
| Next.js Integration | ✅ Native | ✅ Good | ⚠️ Requires SDK |

## Next Steps

- [Authentication Integration](../auth/supabase.md) - Secure uploads with auth
- [Database Integration](../database/supabase.md) - Store file metadata
- [Supabase Storage](supabase.md) - Alternative storage option

