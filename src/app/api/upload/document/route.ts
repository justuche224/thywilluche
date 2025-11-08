import { uploadFile } from "@/lib/upload";
import { serverAuth } from "@/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(request: NextRequest) {
  try {
    const isPermitted = await serverAuth();

    if (!isPermitted) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to upload documents.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const document = formData.get("document") as File;
    const path = formData.get("path") as string;

    if (!document || !path) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Document and path are required.",
        },
        { status: 400 }
      );
    }

    if (document.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large",
          message: `File must be less than 10MB. File "${document.name}" is too large.`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(document.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          message: `File "${document.name}" is not a valid PDF or DOCX file.`,
        },
        { status: 400 }
      );
    }

    const documentUrl = await uploadFile(document, path);

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully.",
      documentUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        message: "An error occurred while uploading the document.",
      },
      { status: 500 }
    );
  }
}
