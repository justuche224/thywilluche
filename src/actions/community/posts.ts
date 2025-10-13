"use server";

import db from "@/db";
import { serverAuth } from "@/lib/server-auth";
import {
  communityPosts,
  communityGroups,
  communityGroupMemberships,
  communityComments,
  communityLikes,
  communityShares,
  user,
} from "@/db/schema";
import { and, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";

export async function getFeed({
  page,
  limit,
  groupId,
  search,
  sort = "desc",
  sortBy = "createdAt",
}: {
  page: number;
  limit: number;
  groupId?: string;
  search?: string;
  sort?: string;
  sortBy?: string;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      page,
      limit,
      groupId,
      search,
      sort,
      sortBy,
      data: [],
      total: 0,
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = session.user.id;

  try {
    // Get user's group memberships
    const userGroups = await db
      .select({ groupId: communityGroupMemberships.groupId })
      .from(communityGroupMemberships)
      .where(
        and(
          eq(communityGroupMemberships.userId, userId),
          eq(communityGroupMemberships.isActive, true)
        )
      );

    const userGroupIds = userGroups.map((g: { groupId: string }) => g.groupId);

    // Build where conditions
    const whereConditions = [eq(communityPosts.status, "approved")];

    // If groupId is specified, only show posts from that group
    if (groupId) {
      whereConditions.push(eq(communityPosts.groupId, groupId));
    } else {
      // Show posts from general forum OR user's groups
      if (userGroupIds.length > 0) {
        whereConditions.push(
          or(
            isNull(communityPosts.groupId), // General forum posts
            inArray(communityPosts.groupId, userGroupIds) // User's group posts
          )!
        );
      } else {
        // If user is not in any groups, only show general forum posts
        whereConditions.push(isNull(communityPosts.groupId));
      }
    }

    // Add search condition if provided
    if (search) {
      whereConditions.push(
        or(
          ilike(communityPosts.content, `%${search}%`),
          ilike(communityPosts.excerpt, `%${search}%`)
        )!
      );
    }

    // Build order by
    let orderBy;
    switch (sortBy) {
      case "createdAt":
        orderBy =
          sort === "desc"
            ? desc(communityPosts.createdAt)
            : communityPosts.createdAt;
        break;
      case "publishedAt":
        orderBy =
          sort === "desc"
            ? desc(communityPosts.publishedAt)
            : communityPosts.publishedAt;
        break;
      case "pinned":
        orderBy = [
          desc(communityPosts.isPinned),
          desc(communityPosts.createdAt),
        ];
        break;
      default:
        orderBy = desc(communityPosts.createdAt);
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityPosts)
      .where(and(...whereConditions));

    // Get posts with pagination and counts
    const posts = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        excerpt: communityPosts.excerpt,
        images: communityPosts.images,
        status: communityPosts.status,
        isPinned: communityPosts.isPinned,
        publishedAt: communityPosts.publishedAt,
        createdAt: communityPosts.createdAt,
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
          AND ${communityComments.parentId} IS NULL
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
          type: communityGroups.type,
        },
      })
      .from(communityPosts)
      .leftJoin(user, eq(communityPosts.authorId, user.id))
      .leftJoin(communityGroups, eq(communityPosts.groupId, communityGroups.id))
      .where(and(...whereConditions))
      .orderBy(...(Array.isArray(orderBy) ? orderBy : [orderBy]))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      page,
      limit,
      groupId,
      search,
      sort,
      sortBy,
      data: posts,
      total: count,
      success: true,
      message: "Feed retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching feed:", error);
    return {
      page,
      limit,
      groupId,
      search,
      sort,
      sortBy,
      data: [],
      total: 0,
      success: false,
      message: "Failed to fetch feed",
    };
  }
}

export async function getPostById(id: string) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const post = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        excerpt: communityPosts.excerpt,
        images: communityPosts.images,
        status: communityPosts.status,
        isPinned: communityPosts.isPinned,
        publishedAt: communityPosts.publishedAt,
        createdAt: communityPosts.createdAt,
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
          AND ${communityComments.parentId} IS NULL
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
          type: communityGroups.type,
        },
      })
      .from(communityPosts)
      .leftJoin(user, eq(communityPosts.authorId, user.id))
      .leftJoin(communityGroups, eq(communityPosts.groupId, communityGroups.id))
      .where(
        and(eq(communityPosts.id, id), eq(communityPosts.status, "approved"))
      )
      .limit(1);

    if (post.length === 0) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    const postData = post[0];

    return {
      success: true,
      data: postData,
      message: "Post retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      message: "Failed to fetch post",
    };
  }
}

export async function getPostComments({
  postId,
  page = 1,
  limit = 10,
}: {
  postId: string;
  page?: number;
  limit?: number;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
      data: [],
      total: 0,
      page,
      limit,
    };
  }

  try {
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(communityComments)
      .where(
        and(
          eq(communityComments.postId, postId),
          isNull(communityComments.parentId),
          eq(communityComments.isDeleted, false)
        )
      );

    const comments = await db
      .select({
        id: communityComments.id,
        content: communityComments.content,
        createdAt: communityComments.createdAt,
        updatedAt: communityComments.updatedAt,
        isEdited: communityComments.isEdited,
        likeCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityLikes} 
          WHERE ${communityLikes.commentId} = ${communityComments.id}
        )`,
        replyCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityComments} replies
          WHERE replies.parent_id = ${communityComments.id}
          AND replies.is_deleted = false
        )`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          displayUsername: user.displayUsername,
          image: user.image,
        },
      })
      .from(communityComments)
      .leftJoin(user, eq(communityComments.authorId, user.id))
      .where(
        and(
          eq(communityComments.postId, postId),
          isNull(communityComments.parentId),
          eq(communityComments.isDeleted, false)
        )
      )
      .orderBy(desc(communityComments.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      success: true,
      data: comments.filter((comment) => comment.author !== null),
      total: totalCount,
      page,
      limit,
      message: "Comments retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      success: false,
      message: "Failed to fetch comments",
      data: [],
      total: 0,
      page,
      limit,
    };
  }
}

export async function getCommentReplies({
  commentId,
  page = 1,
  limit = 10,
}: {
  commentId: string;
  page?: number;
  limit?: number;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
      data: [],
      total: 0,
      page,
      limit,
    };
  }

  try {
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(communityComments)
      .where(
        and(
          eq(communityComments.parentId, commentId),
          eq(communityComments.isDeleted, false)
        )
      );

    const replies = await db
      .select({
        id: communityComments.id,
        content: communityComments.content,
        createdAt: communityComments.createdAt,
        updatedAt: communityComments.updatedAt,
        isEdited: communityComments.isEdited,
        parentId: communityComments.parentId,
        likeCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityLikes} 
          WHERE ${communityLikes.commentId} = ${communityComments.id}
        )`,
        replyCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${communityComments} nested_replies
          WHERE nested_replies.parent_id = ${communityComments.id}
          AND nested_replies.is_deleted = false
        )`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          displayUsername: user.displayUsername,
          image: user.image,
        },
      })
      .from(communityComments)
      .leftJoin(user, eq(communityComments.authorId, user.id))
      .where(
        and(
          eq(communityComments.parentId, commentId),
          eq(communityComments.isDeleted, false)
        )
      )
      .orderBy(desc(communityComments.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      success: true,
      data: replies.filter((reply) => reply.author !== null),
      total: totalCount,
      page,
      limit,
      message: "Replies retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching replies:", error);
    return {
      success: false,
      message: "Failed to fetch replies",
      data: [],
      total: 0,
      page,
      limit,
    };
  }
}

export async function getActiveGroups() {
  try {
    const groups = await db
      .select({
        id: communityGroups.id,
        name: communityGroups.name,
        slug: communityGroups.slug,
        type: communityGroups.type,
        description: communityGroups.description,
      })
      .from(communityGroups)
      .where(eq(communityGroups.isActive, true))
      .orderBy(communityGroups.name);

    return {
      success: true,
      data: groups,
    };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return {
      success: false,
      data: [],
    };
  }
}

export async function createPost({
  content,
  excerpt,
  images,
  groupId,
}: {
  content: string;
  excerpt?: string;
  images?: string[];
  groupId?: string;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        message: "Content is required",
      };
    }

    if (images && images.length > 10) {
      return {
        success: false,
        message: "Maximum 10 images allowed",
      };
    }

    const [newPost] = await db
      .insert(communityPosts)
      .values({
        content,
        excerpt: excerpt || content.substring(0, 200),
        images: images || [],
        authorId: session.user.id,
        groupId: groupId || null,
        status: "pending",
      })
      .returning();

    return {
      success: true,
      message: "Post created successfully and is pending approval",
      data: newPost,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: "Failed to create post",
    };
  }
}

export async function createComment({
  postId,
  content,
  parentId,
}: {
  postId: string;
  content: string;
  parentId?: string;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized. Please sign in to comment.",
    };
  }

  const userId = session.user.id;

  try {
    // Validate content
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        message: "Comment content cannot be empty",
      };
    }

    if (content.length > 5000) {
      return {
        success: false,
        message: "Comment is too long (max 5000 characters)",
      };
    }

    // Verify post exists
    const post = await db
      .select({ id: communityPosts.id })
      .from(communityPosts)
      .where(eq(communityPosts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await db
        .select({ id: communityComments.id })
        .from(communityComments)
        .where(eq(communityComments.id, parentId))
        .limit(1);

      if (parentComment.length === 0) {
        return {
          success: false,
          message: "Parent comment not found",
        };
      }
    }

    // Create the comment
    const [newComment] = await db
      .insert(communityComments)
      .values({
        postId,
        authorId: userId,
        content: content.trim(),
        parentId: parentId || null,
      })
      .returning();

    return {
      success: true,
      message: parentId
        ? "Reply posted successfully"
        : "Comment posted successfully",
      data: newComment,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      message: "Failed to post comment. Please try again.",
    };
  }
}

export async function deleteComment({ commentId }: { commentId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = session.user.id;

  try {
    // Check if user owns the comment
    const comment = await db
      .select({
        id: communityComments.id,
        authorId: communityComments.authorId,
      })
      .from(communityComments)
      .where(eq(communityComments.id, commentId))
      .limit(1);

    if (comment.length === 0) {
      return {
        success: false,
        message: "Comment not found",
      };
    }

    if (comment[0].authorId !== userId) {
      return {
        success: false,
        message: "You can only delete your own comments",
      };
    }

    // Soft delete the comment
    await db
      .update(communityComments)
      .set({ isDeleted: true })
      .where(eq(communityComments.id, commentId));

    return {
      success: true,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      message: "Failed to delete comment",
    };
  }
}

export async function toggleCommentLike({ commentId }: { commentId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = session.user.id;

  try {
    // Check if like already exists
    const existingLike = await db
      .select({ id: communityLikes.id })
      .from(communityLikes)
      .where(
        and(
          eq(communityLikes.userId, userId),
          eq(communityLikes.commentId, commentId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(communityLikes)
        .where(eq(communityLikes.id, existingLike[0].id));

      return {
        success: true,
        liked: false,
        message: "Comment unliked",
      };
    } else {
      // Like
      await db.insert(communityLikes).values({
        userId,
        commentId,
      });

      return {
        success: true,
        liked: true,
        message: "Comment liked",
      };
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return {
      success: false,
      message: "Failed to like/unlike comment",
    };
  }
}

export async function checkCommentLikeStatus({
  commentId,
}: {
  commentId: string;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      liked: false,
    };
  }

  const userId = session.user.id;

  try {
    const existingLike = await db
      .select({ id: communityLikes.id })
      .from(communityLikes)
      .where(
        and(
          eq(communityLikes.userId, userId),
          eq(communityLikes.commentId, commentId)
        )
      )
      .limit(1);

    return {
      success: true,
      liked: existingLike.length > 0,
    };
  } catch (error) {
    console.error("Error checking comment like status:", error);
    return {
      success: false,
      liked: false,
    };
  }
}

export async function togglePostLike({ postId }: { postId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = session.user.id;

  try {
    // Check if like already exists
    const existingLike = await db
      .select({ id: communityLikes.id })
      .from(communityLikes)
      .where(
        and(
          eq(communityLikes.userId, userId),
          eq(communityLikes.postId, postId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(communityLikes)
        .where(eq(communityLikes.id, existingLike[0].id));

      return {
        success: true,
        liked: false,
        message: "Post unliked",
      };
    } else {
      // Like
      await db.insert(communityLikes).values({
        userId,
        postId,
      });

      return {
        success: true,
        liked: true,
        message: "Post liked",
      };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    return {
      success: false,
      message: "Failed to like/unlike post",
    };
  }
}

export async function checkPostLikeStatus({ postId }: { postId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      liked: false,
    };
  }

  const userId = session.user.id;

  try {
    const existingLike = await db
      .select({ id: communityLikes.id })
      .from(communityLikes)
      .where(
        and(
          eq(communityLikes.userId, userId),
          eq(communityLikes.postId, postId)
        )
      )
      .limit(1);

    return {
      success: true,
      liked: existingLike.length > 0,
    };
  } catch (error) {
    console.error("Error checking post like status:", error);
    return {
      success: false,
      liked: false,
    };
  }
}

export async function createShare({ postId }: { postId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = session.user.id;

  try {
    // Verify post exists
    const post = await db
      .select({ id: communityPosts.id })
      .from(communityPosts)
      .where(eq(communityPosts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Create share record
    await db.insert(communityShares).values({
      postId,
      userId,
    });

    return {
      success: true,
      message: "Post shared successfully",
    };
  } catch (error) {
    console.error("Error creating share:", error);
    return {
      success: false,
      message: "Failed to share post",
    };
  }
}
