"use server";

import { requireAdmin } from "@/lib/server-auth";
import { uploadFile } from "@/lib/upload";

const uploadImageAction = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to upload an image.",
    };
  }

  const image = formData.get("image");
  const path = formData.get("path");

  if (!image || !path) {
    return {
      error: "Missing required fields",
      message: "Image and path are required.",
    };
  }

  const imageUrl = await uploadFile(image as File, path as string);

  return {
    success: true,
    message: "Image uploaded successfully.",
    imageUrl,
  };
};

export default uploadImageAction;
