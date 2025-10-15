"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import {
  communityPosts,
  communityGroups,
  communityComments,
  communityLikes,
  communityShares,
  communityReports,
  user,
} from "@/db/schema";
import { and, desc, eq, sql, count } from "drizzle-orm";

export async function getReports({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: "pending" | "reviewed" | "resolved" | "dismissed";
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
      whereConditions.push(eq(communityReports.status, status));
    }

    const reports = await db
      .select({
        id: communityReports.id,
        reason: communityReports.reason,
        description: communityReports.description,
        status: communityReports.status,
        createdAt: communityReports.createdAt,
        reviewedAt: communityReports.reviewedAt,
        resolution: communityReports.resolution,
        reporter: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
        postId: communityReports.postId,
        commentId: communityReports.commentId,
        post: {
          id: communityPosts.id,
          content: communityPosts.content,
          excerpt: communityPosts.excerpt,
          status: communityPosts.status,
          authorId: communityPosts.authorId,
        },
        comment: {
          id: communityComments.id,
          content: communityComments.content,
        },
      })
      .from(communityReports)
      .leftJoin(user, eq(communityReports.reporterId, user.id))
      .leftJoin(communityPosts, eq(communityReports.postId, communityPosts.id))
      .leftJoin(
        communityComments,
        eq(communityReports.commentId, communityComments.id)
      )
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(communityReports.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(communityReports)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return {
      success: true,
      data: reports,
      total: totalCount,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return {
      success: false,
      message: "Failed to fetch reports",
    };
  }
}

export async function updateReportStatus({
  reportId,
  status,
  resolution,
}: {
  reportId: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  resolution?: string;
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
      .update(communityReports)
      .set({
        status,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        resolution: resolution || null,
      })
      .where(eq(communityReports.id, reportId));

    return {
      success: true,
      message: `Report ${status} successfully`,
    };
  } catch (error) {
    console.error("Error updating report status:", error);
    return {
      success: false,
      message: "Failed to update report status",
    };
  }
}

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
      totalReportsResult,
      pendingReportsResult,
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
      db.select({ totalReports: count() }).from(communityReports),
      db
        .select({ pendingReports: count() })
        .from(communityReports)
        .where(eq(communityReports.status, "pending")),
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
        totalReports: totalReportsResult[0].totalReports,
        pendingReports: pendingReportsResult[0].pendingReports,
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
