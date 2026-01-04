import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Create the R2 client
export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

const bucket = process.env.R2_BUCKET_NAME!;
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

/**
 * Upload a file to R2
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | ReadableStream,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ key: string; url: string }> {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
    })
  );

  return {
    key,
    url: getPublicUrl(key),
  };
}

/**
 * Get a file from R2
 */
export async function getFile(key: string): Promise<{
  body: ReadableStream | undefined;
  contentType: string | undefined;
  metadata: Record<string, string> | undefined;
}> {
  const client = getR2Client();

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return {
    body: response.Body as ReadableStream | undefined,
    contentType: response.ContentType,
    metadata: response.Metadata,
  };
}

/**
 * Delete a file from R2
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * List files in a directory
 */
export async function listFiles(
  prefix?: string,
  maxKeys = 100
): Promise<{ key: string; size: number; lastModified: Date | undefined }[]> {
  const client = getR2Client();

  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    })
  );

  return (
    response.Contents?.map((item) => ({
      key: item.Key!,
      size: item.Size!,
      lastModified: item.LastModified,
    })) || []
  );
}

/**
 * Check if a file exists
 */
export async function fileExists(key: string): Promise<boolean> {
  const client = getR2Client();

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a presigned URL for uploading
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const client = getR2Client();

  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn }
  );
}

/**
 * Get a presigned URL for downloading
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const client = getR2Client();

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn }
  );
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(key: string): string {
  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }
  // Fallback to presigned URL if no public URL configured
  return getPresignedDownloadUrl(key).toString();
}

