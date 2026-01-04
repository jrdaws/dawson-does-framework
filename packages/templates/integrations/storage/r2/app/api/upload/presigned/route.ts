import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/storage/r2";
import { generateFileKey, validateFileType } from "@/lib/storage/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

/**
 * POST /api/upload/presigned
 * Get a presigned URL for direct upload to R2
 */
export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(contentType, ALLOWED_TYPES)) {
      return NextResponse.json(
        { error: `File type ${contentType} is not allowed` },
        { status: 400 }
      );
    }

    // Generate unique key
    const key = generateFileKey(filename);

    // Get presigned URL
    const uploadUrl = await getPresignedUploadUrl(key, contentType, 3600); // 1 hour expiry

    return NextResponse.json({
      key,
      uploadUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("[Presigned URL Error]", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}

