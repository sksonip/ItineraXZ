import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file was uploaded.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The uploaded file is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File size must be less than 10 MB.",
        },
        { status: 413 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Allowed files: JPG, PNG, WEBP and PDF.",
        },
        { status: 415 }
      );
    }

    /*
     * Temporary upload handling.
     *
     * We are NOT permanently storing the file yet.
     * The next version can upload the bytes to
     * Supabase Storage / S3.
     */

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /*
     * Prevent unused-buffer issues while this endpoint
     * is still using temporary storage.
     *
     * Replace this section with actual cloud storage.
     */

    console.log("Received file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      bytes: buffer.length,
    });

    return NextResponse.json(
      {
        message: "File uploaded successfully.",
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}