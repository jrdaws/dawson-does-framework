/**
 * Cloudinary Upload Utilities
 * 
 * Client-side upload helpers for Cloudinary.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  transformation?: string;
  tags?: string[];
}

/**
 * Upload a file to Cloudinary
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folder, resourceType = "auto", tags = [] } = options;

  // Get signed upload params from server
  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, tags }),
  });

  if (!signResponse.ok) {
    throw new Error("Failed to get upload signature");
  }

  const { signature, timestamp, apiKey } = await signResponse.json();

  // Upload to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);

  if (folder) formData.append("folder", folder);
  if (tags.length) formData.append("tags", tags.join(","));

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("Upload failed");
  }

  const result = await uploadResponse.json();

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadFile(file, options)));
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: string
): string {
  if (!CLOUD_NAME) return "";

  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  const transforms = transformations ? `/${transformations}` : "";

  return `${base}${transforms}/${publicId}`;
}

