/**
 * Cloudinary Configuration
 * 
 * Server-side Cloudinary client for image/video management.
 */

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(`
⚠️  Cloudinary configuration missing

Required environment variables:
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET

Get these from: https://cloudinary.com/console
Add to: .env.local

Image optimization will not work until configured.
  `);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

/**
 * Generate a signed upload URL
 */
export function generateSignature(paramsToSign: Record<string, string>) {
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret || ""
  );
  return signature;
}

/**
 * Get optimized image URL with transformations
 */
export function getImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "crop";
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
  } = {}
): string {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop,
        quality,
        fetch_format: format,
      },
    ],
  });
}

/**
 * Delete an image by public ID
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Failed to delete image:", error);
    return false;
  }
}

/**
 * Upload image from URL
 */
export async function uploadFromUrl(
  url: string,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<string> {
  const result = await cloudinary.uploader.upload(url, {
    folder: options.folder,
    public_id: options.publicId,
  });
  return result.public_id;
}

