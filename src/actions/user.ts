"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  const session = await serverAuth();

  if (!session || session.user.id !== userId) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  try {
    const userProfile = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
        displayUsername: user.displayUsername,
        bio: user.bio,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userProfile.length === 0) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: userProfile[0],
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      message: "Failed to fetch profile",
      data: null,
    };
  }
}

export const getUserRole = async (userId: string) => {
    const userData = await db.select({role: user.role}).from(user).where(eq(user.id, userId)).limit(1);
    return userData[0].role;
};

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    username?: string | null;
    displayUsername?: string | null;
    bio?: string | null;
    image?: string;
  }
) {
  const session = await serverAuth();

  if (!session || session.user.id !== userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const updateData: {
      name?: string;
      username?: string | null;
      displayUsername?: string | null;
      bio?: string | null;
      image?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.displayUsername !== undefined)
      updateData.displayUsername = data.displayUsername;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.image !== undefined) updateData.image = data.image;

    const result = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        message: "Failed to update profile",
      };
    }

    revalidatePath("/community/profile");
    revalidatePath("/community");

    return {
      success: true,
      message: "Profile updated successfully",
      data: result[0],
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}

export async function checkUsernameAvailability(
  username: string,
  userId: string
) {
  const session = await serverAuth();

  if (!session || session.user.id !== userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    const isAvailable =
      existingUser.length === 0 || existingUser[0].id === userId;

    return {
      success: true,
      available: isAvailable,
      message: isAvailable
        ? "Username is available"
        : "Username is already taken",
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return {
      success: false,
      message: "Failed to check username availability",
    };
  }
}
