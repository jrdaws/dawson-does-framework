import { uploadFile, getPublicUrl } from "./r2";
import crypto from "crypto";

export interface UploadResult {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
}

/**
 * Generate a unique file key
 */
export function generateFileKey(
  filename: string,
  prefix = "uploads"
): string {
  const ext = filename.split(".").pop() || "";
  const hash = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${prefix}/${timestamp}-${hash}.${ext}`;
}

/**
 * Validate file type
 */
export function validateFileType(
  contentType: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const category = type.replace("/*", "");
      return contentType.startsWith(category);
    }
    return contentType === type;
  });
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSizeBytes: number): boolean {
  return size <= maxSizeBytes;
}

/**
 * Upload a file with validation
 */
export async function uploadWithValidation(
  file: File,
  options: {
    prefix?: string;
    maxSize?: number;
    allowedTypes?: string[];
    metadata?: Record<string, string>;
  } = {}
): Promise<UploadResult> {
  const {
    prefix = "uploads",
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ["image/*", "application/pdf"],
    metadata,
  } = options;

  // Validate file type
  if (!validateFileType(file.type, allowedTypes)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }

  // Validate file size
  if (!validateFileSize(file.size, maxSize)) {
    throw new Error(
      `File size exceeds maximum of ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    );
  }

  // Generate unique key
  const key = generateFileKey(file.name, prefix);

  // Convert to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload
  await uploadFile(key, buffer, file.type, metadata);

  return {
    key,
    url: getPublicUrl(key),
    filename: file.name,
    contentType: file.type,
    size: file.size,
  };
}

/**
 * Upload multiple files
 */
export async function uploadMultiple(
  files: File[],
  options: {
    prefix?: string;
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadWithValidation(file, options)));
}

/**
 * Get image dimensions if the file is an image
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) {
    return null;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

