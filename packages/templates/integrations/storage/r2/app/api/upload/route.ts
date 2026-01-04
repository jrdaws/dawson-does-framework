import { NextRequest, NextResponse } from "next/server";
import { uploadFile, getPublicUrl } from "@/lib/storage/r2";
import { generateFileKey, validateFileType, validateFileSize } from "@/lib/storage/upload";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

/**
 * POST /api/upload
 * Upload a file to R2
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!validateFileType(file.type, ALLOWED_TYPES)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file.size, MAX_SIZE)) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Generate unique key
    const key = generateFileKey(file.name);

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2
    await uploadFile(key, buffer, file.type);

    return NextResponse.json({
      key,
      url: getPublicUrl(key),
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("[Upload Error]", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

