"use server";

import db from "@/db";
import { mediaHighlights } from "@/db/schema/media-highlights";
import { eq, desc } from "drizzle-orm";

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
