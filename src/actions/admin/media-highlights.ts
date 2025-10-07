"use server";

import { requireAdmin } from "@/lib/server-auth";
import db from "@/db";
import { mediaHighlights } from "@/db/schema/media-highlights";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getMediaHighlights = async () => {
  try {
    const highlights = await db
      .select()
      .from(mediaHighlights)
      .where(eq(mediaHighlights.isActive, true))
      .orderBy(mediaHighlights.sortOrder, desc(mediaHighlights.createdAt));

    return { success: true, data: highlights };
  } catch (error) {
    console.error("Error fetching media highlights:", error);
    return { success: false, error: "Failed to fetch media highlights" };
  }
};

export const getAllMediaHighlights = async () => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      success: false,
      error: "Unauthorized",
      message: "You are not authorized to access this data.",
    };
  }

  try {
    const highlights = await db
      .select()
      .from(mediaHighlights)
      .orderBy(mediaHighlights.sortOrder, desc(mediaHighlights.createdAt));

    return { success: true, data: highlights };
  } catch (error) {
    console.error("Error fetching all media highlights:", error);
    return { success: false, error: "Failed to fetch media highlights" };
  }
};

export const createMediaHighlight = async (data: {
  type: string;
  title: string;
  description: string;
  quote: string;
  image: string;
  color?: string;
  date: string;
  sortOrder?: number;
}) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      success: false,
      error: "Unauthorized",
      message: "You are not authorized to create media highlights.",
    };
  }

  try {
    const [highlight] = await db
      .insert(mediaHighlights)
      .values({
        type: data.type,
        title: data.title,
        description: data.description,
        quote: data.quote,
        image: data.image,
        color: data.color || "primary",
        date: data.date,
        sortOrder: data.sortOrder || 0,
      })
      .returning();

    revalidatePath("/about");
    revalidatePath("/admin/media-highlights");

    return { success: true, data: highlight };
  } catch (error) {
    console.error("Error creating media highlight:", error);
    return { success: false, error: "Failed to create media highlight" };
  }
};

export const updateMediaHighlight = async (
  id: string,
  data: {
    type?: string;
    title?: string;
    description?: string;
    quote?: string;
    image?: string;
    color?: string;
    date?: string;
    isActive?: boolean;
    sortOrder?: number;
  }
) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      success: false,
      error: "Unauthorized",
      message: "You are not authorized to update media highlights.",
    };
  }

  try {
    const [highlight] = await db
      .update(mediaHighlights)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(mediaHighlights.id, id))
      .returning();

    if (!highlight) {
      return { success: false, error: "Media highlight not found" };
    }

    revalidatePath("/about");
    revalidatePath("/admin/media-highlights");

    return { success: true, data: highlight };
  } catch (error) {
    console.error("Error updating media highlight:", error);
    return { success: false, error: "Failed to update media highlight" };
  }
};

export const deleteMediaHighlight = async (id: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      success: false,
      error: "Unauthorized",
      message: "You are not authorized to delete media highlights.",
    };
  }

  try {
    const [highlight] = await db
      .delete(mediaHighlights)
      .where(eq(mediaHighlights.id, id))
      .returning();

    if (!highlight) {
      return { success: false, error: "Media highlight not found" };
    }

    revalidatePath("/about");
    revalidatePath("/admin/media-highlights");

    return { success: true, data: highlight };
  } catch (error) {
    console.error("Error deleting media highlight:", error);
    return { success: false, error: "Failed to delete media highlight" };
  }
};
