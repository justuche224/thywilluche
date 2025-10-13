"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import {
  communityPosts,
  communityGroups,
  communityComments,
  communityLikes,
  communityShares,
  user,
} from "@/db/schema";
import { and, desc, eq, sql, count } from "drizzle-orm";

// Get all posts with filtering and pagination
export async function getPostsForAdmin({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected";
  search?: string;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const whereConditions = [];

    if (status) {
      whereConditions.push(eq(communityPosts.status, status));
    }

    if (search) {
      whereConditions.push(
        sql`${communityPosts.content} ILIKE ${`%${search}%`}`
      );
    }

    const posts = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        excerpt: communityPosts.excerpt,
        images: communityPosts.images,
        status: communityPosts.status,
        createdAt: communityPosts.createdAt,
        publishedAt: communityPosts.publishedAt,
        likeCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityLikes} 
          WHERE ${communityLikes.postId} = ${communityPosts.id}
        )`,
        shareCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityShares} 
          WHERE ${communityShares.postId} = ${communityPosts.id}
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityComments} 
          WHERE ${communityComments.postId} = ${communityPosts.id}
          AND ${communityComments.isDeleted} = false
        )`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          displayUsername: user.displayUsername,
          image: user.image,
        },
        group: {
          id: communityGroups.id,
          name: communityGroups.name,
          slug: communityGroups.slug,
        },
      })
      .from(communityPosts)
      .leftJoin(user, eq(communityPosts.authorId, user.id))
      .leftJoin(communityGroups, eq(communityPosts.groupId, communityGroups.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(communityPosts)
      .leftJoin(user, eq(communityPosts.authorId, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return {
      success: true,
      data: posts,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching posts for admin:", error);
    return {
      success: false,
      message: "Failed to fetch posts",
    };
  }
}

// Update post status
export async function updatePostStatus({
  postId,
  status,
}: {
  postId: string;
  status: "pending" | "approved" | "rejected";
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
      .update(communityPosts)
      .set({
        status,
        publishedAt: status === "approved" ? new Date() : null,
      })
      .where(eq(communityPosts.id, postId));

    return {
      success: true,
      message: `Post ${status} successfully`,
    };
  } catch (error) {
    console.error("Error updating post status:", error);
    return {
      success: false,
      message: "Failed to update post status",
    };
  }
}

// Get all groups
export async function getGroupsForAdmin() {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const groups = await db
      .select({
        id: communityGroups.id,
        name: communityGroups.name,
        slug: communityGroups.slug,
        type: communityGroups.type,
        description: communityGroups.description,
        isActive: communityGroups.isActive,
        createdAt: communityGroups.createdAt,
        postCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityPosts} 
          WHERE ${communityPosts.groupId} = ${communityGroups.id}
          AND ${communityPosts.status} = 'approved'
        )`,
        memberCount: sql<number>`(
          SELECT COUNT(*) 
          FROM community_group_memberships 
          WHERE community_group_memberships.group_id = ${communityGroups.id}
        )`,
      })
      .from(communityGroups)
      .orderBy(desc(communityGroups.createdAt));

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error("Error fetching groups for admin:", error);
    return {
      success: false,
      message: "Failed to fetch groups",
    };
  }
}

// Create new group
export async function createGroup({
  name,
  slug,
  type,
  description,
}: {
  name: string;
  slug: string;
  type: string;
  description: string;
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [newGroup] = await db
      .insert(communityGroups)
      .values({
        name,
        slug,
        type,
        description,
        isActive: true,
      })
      .returning();

    return {
      success: true,
      message: "Group created successfully",
      data: newGroup,
    };
  } catch (error) {
    console.error("Error creating group:", error);
    return {
      success: false,
      message: "Failed to create group",
    };
  }
}

// Update group
export async function updateGroup({
  groupId,
  name,
  slug,
  type,
  description,
  isActive,
}: {
  groupId: string;
  name: string;
  slug: string;
  type: string;
  description: string;
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
      .update(communityGroups)
      .set({
        name,
        slug,
        type,
        description,
        isActive,
      })
      .where(eq(communityGroups.id, groupId));

    return {
      success: true,
      message: "Group updated successfully",
    };
  } catch (error) {
    console.error("Error updating group:", error);
    return {
      success: false,
      message: "Failed to update group",
    };
  }
}

// Delete group
export async function deleteGroup({ groupId }: { groupId: string }) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    // Check if group has posts
    const postCount = await db
      .select({ count: count() })
      .from(communityPosts)
      .where(eq(communityPosts.groupId, groupId));

    if (postCount[0].count > 0) {
      return {
        success: false,
        message: "Cannot delete group with existing posts",
      };
    }

    await db.delete(communityGroups).where(eq(communityGroups.id, groupId));

    return {
      success: true,
      message: "Group deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting group:", error);
    return {
      success: false,
      message: "Failed to delete group",
    };
  }
}

// Get all users
export async function getUsersForAdmin({
  page = 1,
  limit = 10,
  search,
  role,
}: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "USER" | "ADMIN";
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const whereConditions = [];

    if (role) {
      whereConditions.push(eq(user.role, role));
    }

    if (search) {
      whereConditions.push(sql`${user.name} ILIKE ${`%${search}%`}`);
    }

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        displayUsername: user.displayUsername,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        postCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityPosts} 
          WHERE ${communityPosts.authorId} = ${user.id}
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityComments} 
          WHERE ${communityComments.authorId} = ${user.id}
          AND ${communityComments.isDeleted} = false
        )`,
      })
      .from(user)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(user)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return {
      success: true,
      data: users,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return {
      success: false,
      message: "Failed to fetch users",
    };
  }
}

// Update user role
export async function updateUserRole({
  userId,
  role,
}: {
  userId: string;
  role: "USER" | "ADMIN";
}) {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db.update(user).set({ role }).where(eq(user.id, userId));

    return {
      success: true,
      message: "User role updated successfully",
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      message: "Failed to update user role",
    };
  }
}

// Get recent activity
export async function getRecentActivity() {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [recentPosts, recentComments, recentUsers] = await Promise.all([
      db
        .select({
          id: communityPosts.id,
          content: communityPosts.content,
          status: communityPosts.status,
          createdAt: communityPosts.createdAt,
          author: {
            name: user.name,
            username: user.username,
            displayUsername: user.displayUsername,
          },
        })
        .from(communityPosts)
        .leftJoin(user, eq(communityPosts.authorId, user.id))
        .orderBy(desc(communityPosts.createdAt))
        .limit(5),

      db
        .select({
          id: communityComments.id,
          content: communityComments.content,
          createdAt: communityComments.createdAt,
          author: {
            name: user.name,
            username: user.username,
            displayUsername: user.displayUsername,
          },
          post: {
            id: communityPosts.id,
            content: communityPosts.content,
          },
        })
        .from(communityComments)
        .leftJoin(user, eq(communityComments.authorId, user.id))
        .leftJoin(
          communityPosts,
          eq(communityComments.postId, communityPosts.id)
        )
        .where(eq(communityComments.isDeleted, false))
        .orderBy(desc(communityComments.createdAt))
        .limit(5),

      db
        .select({
          id: user.id,
          name: user.name,
          username: user.username,
          displayUsername: user.displayUsername,
          createdAt: user.createdAt,
        })
        .from(user)
        .orderBy(desc(user.createdAt))
        .limit(5),
    ]);

    return {
      success: true,
      data: {
        recentPosts,
        recentComments,
        recentUsers,
      },
    };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return {
      success: false,
      message: "Failed to fetch recent activity",
    };
  }
}

// Get community statistics
export async function getCommunityStats() {
  const session = await serverAuth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const [
      totalPostsResult,
      pendingPostsResult,
      approvedPostsResult,
      rejectedPostsResult,
      totalCommentsResult,
      totalLikesResult,
      totalSharesResult,
      totalUsersResult,
      totalGroupsResult,
    ] = await Promise.all([
      db.select({ totalPosts: count() }).from(communityPosts),
      db
        .select({ pendingPosts: count() })
        .from(communityPosts)
        .where(eq(communityPosts.status, "pending")),
      db
        .select({ approvedPosts: count() })
        .from(communityPosts)
        .where(eq(communityPosts.status, "approved")),
      db
        .select({ rejectedPosts: count() })
        .from(communityPosts)
        .where(eq(communityPosts.status, "rejected")),
      db
        .select({ totalComments: count() })
        .from(communityComments)
        .where(eq(communityComments.isDeleted, false)),
      db.select({ totalLikes: count() }).from(communityLikes),
      db.select({ totalShares: count() }).from(communityShares),
      db.select({ totalUsers: count() }).from(user),
      db.select({ totalGroups: count() }).from(communityGroups),
    ]);

    return {
      success: true,
      data: {
        totalPosts: totalPostsResult[0].totalPosts,
        pendingPosts: pendingPostsResult[0].pendingPosts,
        approvedPosts: approvedPostsResult[0].approvedPosts,
        rejectedPosts: rejectedPostsResult[0].rejectedPosts,
        totalComments: totalCommentsResult[0].totalComments,
        totalLikes: totalLikesResult[0].totalLikes,
        totalShares: totalSharesResult[0].totalShares,
        totalUsers: totalUsersResult[0].totalUsers,
        totalGroups: totalGroupsResult[0].totalGroups,
      },
    };
  } catch (error) {
    console.error("Error fetching community stats:", error);
    return {
      success: false,
      message: "Failed to fetch community statistics",
    };
  }
}
