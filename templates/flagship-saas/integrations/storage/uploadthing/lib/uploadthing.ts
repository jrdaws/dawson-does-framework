/**
 * UploadThing Integration - Core Library
 *
 * Type-safe file uploads for Next.js
 * https://uploadthing.com
 */

import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Environment validation
if (!process.env.UPLOADTHING_TOKEN) {
  console.warn(`
UploadThing configuration missing

Required environment variable:
  UPLOADTHING_TOKEN

Get your token from: https://uploadthing.com/dashboard
Add to: .env.local
  `);
}

/**
 * Pre-built Upload Button component
 * Use: <UploadButton endpoint="imageUploader" onClientUploadComplete={(res) => console.log(res)} />
 */
export const UploadButton = generateUploadButton<OurFileRouter>();

/**
 * Pre-built Dropzone component for drag-and-drop uploads
 * Use: <UploadDropzone endpoint="imageUploader" onClientUploadComplete={(res) => console.log(res)} />
 */
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

/**
 * React hooks for custom upload implementations
 */
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

/**
 * File type configurations for common use cases
 */
export const FileTypes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
} as const;

/**
 * Maximum file sizes in MB
 */
export const MaxFileSizes = {
  image: 4,      // 4MB for images
  document: 16,  // 16MB for documents
  video: 64,     // 64MB for videos
  audio: 16,     // 16MB for audio
} as const;

/**
 * Utility to get file extension from URL
 */
export function getFileExtension(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = pathname.split(".").pop();
  return ext || "";
}

/**
 * Utility to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Type for uploaded file result
 */
export interface UploadedFile {
  key: string;
  url: string;
  name: string;
  size: number;
}

/**
 * Type for upload error
 */
export interface UploadError {
  code: string;
  message: string;
}

