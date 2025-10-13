import { uploadFile } from "@/lib/upload";
import { serverAuth } from "@/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const isPermitted = await serverAuth();

    if (!isPermitted) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to upload images.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const images = formData.getAll("images") as File[];
    const path = formData.get("path") as string;

    if (!images || images.length === 0 || !path) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Images and path are required.",
        },
        { status: 400 }
      );
    }

    if (images.length > MAX_IMAGES) {
      return NextResponse.json(
        {
          error: "Too many images",
          message: `Maximum ${MAX_IMAGES} images allowed.`,
        },
        { status: 400 }
      );
    }

    for (const image of images) {
      if (image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: "File too large",
            message: `Each image must be less than 5MB. File "${image.name}" is too large.`,
          },
          { status: 400 }
        );
      }

      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error: "Invalid file type",
            message: `File "${image.name}" is not an image.`,
          },
          { status: 400 }
        );
      }
    }

    const uploadPromises = images.map((image) => uploadFile(image, path));
    const imageUrls = await Promise.all(uploadPromises);

    const response = {
      success: true,
      message: `${images.length} image(s) uploaded successfully.`,
      imageUrls,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        message: "An error occurred while uploading images.",
      },
      { status: 500 }
    );
  }
}
