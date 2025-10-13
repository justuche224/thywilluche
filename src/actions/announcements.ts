"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import { announcements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getActiveAnnouncements() {
  try {
    const activeAnnouncements = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        link: announcements.link,
        createdAt: announcements.createdAt,
      })
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.createdAt));

    return {
      success: true,
      data: activeAnnouncements,
    };
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    return {
      success: false,
      message: "Failed to fetch announcements",
    };
  }
}

export async function getAllAnnouncements() {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const allAnnouncements = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));

    return {
      success: true,
      data: allAnnouncements,
    };
  } catch (error) {
    console.error("Error fetching all announcements:", error);
    return {
      success: false,
      message: "Failed to fetch announcements",
    };
  }
}

export async function createAnnouncement({
  title,
  content,
  link,
}: {
  title: string;
  content: string;
  link?: string;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values({
        title,
        content,
        link,
        isActive: true,
      })
      .returning();

    return {
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return {
      success: false,
      message: "Failed to create announcement",
    };
  }
}

export async function updateAnnouncement({
  id,
  title,
  content,
  link,
  isActive,
}: {
  id: string;
  title: string;
  content: string;
  link?: string;
  isActive: boolean;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db
      .update(announcements)
      .set({
        title,
        content,
        link,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, id));

    return {
      success: true,
      message: "Announcement updated successfully",
    };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return {
      success: false,
      message: "Failed to update announcement",
    };
  }
}

export async function deleteAnnouncement({ id }: { id: string }) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db.delete(announcements).where(eq(announcements.id, id));

    return {
      success: true,
      message: "Announcement deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return {
      success: false,
      message: "Failed to delete announcement",
    };
  }
}
