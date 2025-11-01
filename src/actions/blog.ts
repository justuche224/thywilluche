"use server";

import db from "@/db";
import {
  blogPosts,
  blogCategories,
  blogComments,
  blogLikes,
  blogShares,
  user,
} from "@/db/schema";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { serverAuth } from "@/lib/server-auth";
import {
  notifyNewLike,
  notifyNewComment,
  notifyNewShare,
} from "@/mailer/handlers/blog/posts";

type BlogCategory = (typeof blogCategories)[number];

export async function getPublishedBlogPosts(category?: string) {
  if (category && blogCategories.includes(category as BlogCategory)) {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        category: blogPosts.category,
        tags: blogPosts.tags,
        imageUrl: blogPosts.imageUrl,
        content: blogPosts.content,
        status: blogPosts.status,
        isFeatured: blogPosts.isFeatured,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        likeCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_likes 
          WHERE blog_likes.post_id = blog_posts.id
        )`,
        shareCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_shares 
          WHERE blog_shares.post_id = blog_posts.id
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_comments 
          WHERE blog_comments.post_id = blog_posts.id 
          AND blog_comments.parent_id IS NULL
          AND blog_comments.is_deleted = false
        )`,
      })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, "published"),
          eq(blogPosts.category, category as BlogCategory)
        )
      )
      .orderBy(blogPosts.publishedAt);

    return posts;
  }

  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      tags: blogPosts.tags,
      imageUrl: blogPosts.imageUrl,
      content: blogPosts.content,
      status: blogPosts.status,
      isFeatured: blogPosts.isFeatured,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      likeCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM blog_likes 
        WHERE blog_likes.post_id = blog_posts.id
      )`,
      shareCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM blog_shares 
        WHERE blog_shares.post_id = blog_posts.id
      )`,
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM blog_comments 
        WHERE blog_comments.post_id = blog_posts.id 
        AND blog_comments.parent_id IS NULL
        AND blog_comments.is_deleted = false
      )`,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(blogPosts.publishedAt);

  console.log("posts.length: " + posts.length);
  console.log("posts[0].likeCount: " + posts[0].likeCount);
  console.log("posts[0].shareCount: " + posts[0].shareCount);
  console.log("posts[0].commentCount: " + posts[0].commentCount);

  return posts;
}

export async function getBlogPostBySlug(slug: string) {
  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      tags: blogPosts.tags,
      imageUrl: blogPosts.imageUrl,
      content: blogPosts.content,
      status: blogPosts.status,
      isFeatured: blogPosts.isFeatured,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      likeCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM blog_likes 
        WHERE blog_likes.post_id = blog_posts.id
      )`,
      shareCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM blog_shares 
        WHERE blog_shares.post_id = blog_posts.id
      )`,
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM blog_comments 
        WHERE blog_comments.post_id = blog_posts.id 
        AND blog_comments.parent_id IS NULL
        AND blog_comments.is_deleted = false
      )`,
    })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  console.log("post.likeCount: " + post.likeCount);
  console.log("post.shareCount: " + post.shareCount);
  console.log("post.commentCount: " + post.commentCount);

  return post;
}

export async function getFeaturedBlogPosts() {
  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isFeatured, true))
    .orderBy(blogPosts.publishedAt)
    .limit(3);
}

export async function getBlogComments({
  postId,
  page = 1,
  limit = 10,
}: {
  postId: string;
  page?: number;
  limit?: number;
}) {
  try {
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(blogComments)
      .where(
        and(
          eq(blogComments.postId, postId),
          isNull(blogComments.parentId),
          eq(blogComments.isDeleted, false)
        )
      );

    const comments = await db
      .select({
        id: blogComments.id,
        content: blogComments.content,
        createdAt: blogComments.createdAt,
        updatedAt: blogComments.updatedAt,
        isEdited: blogComments.isEdited,
        likeCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_likes 
          WHERE blog_likes.comment_id = ${blogComments.id}
        )`,
        replyCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_comments replies
          WHERE replies.parent_id = ${blogComments.id}
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
      .from(blogComments)
      .leftJoin(user, eq(blogComments.authorId, user.id))
      .where(
        and(
          eq(blogComments.postId, postId),
          isNull(blogComments.parentId),
          eq(blogComments.isDeleted, false)
        )
      )
      .orderBy(desc(blogComments.createdAt))
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
    console.error("Error fetching blog comments:", error);
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
  try {
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(blogComments)
      .where(
        and(
          eq(blogComments.parentId, commentId),
          eq(blogComments.isDeleted, false)
        )
      );

    const replies = await db
      .select({
        id: blogComments.id,
        content: blogComments.content,
        createdAt: blogComments.createdAt,
        updatedAt: blogComments.updatedAt,
        isEdited: blogComments.isEdited,
        parentId: blogComments.parentId,
        likeCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_likes 
          WHERE blog_likes.comment_id = ${blogComments.id}
        )`,
        replyCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM blog_comments nested_replies
          WHERE nested_replies.parent_id = ${blogComments.id}
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
      .from(blogComments)
      .leftJoin(user, eq(blogComments.authorId, user.id))
      .where(
        and(
          eq(blogComments.parentId, commentId),
          eq(blogComments.isDeleted, false)
        )
      )
      .orderBy(desc(blogComments.createdAt))
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

export async function createBlogComment({
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

    const post = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return {
        success: false,
        message: "Blog post not found",
      };
    }

    if (parentId) {
      const parentComment = await db
        .select({ id: blogComments.id })
        .from(blogComments)
        .where(eq(blogComments.id, parentId))
        .limit(1);

      if (parentComment.length === 0) {
        return {
          success: false,
          message: "Parent comment not found",
        };
      }
    }

    const [newComment] = await db
      .insert(blogComments)
      .values({
        postId,
        authorId: userId,
        content: content.trim(),
        parentId: parentId || null,
      })
      .returning();

    try {
      const [post] = await db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
        })
        .from(blogPosts)
        .where(eq(blogPosts.id, postId))
        .limit(1);

      if (post) {
        const [commentAuthor] = await db
          .select({
            name: user.name,
            username: user.username,
          })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);

        if (commentAuthor) {
          await notifyNewComment({
            postId: post.id,
            postSlug: post.slug,
            postTitle: post.title,
            commentAuthorName: commentAuthor.name || "Unknown User",
            commentAuthorUsername: commentAuthor.username || "unknown",
            commentContent: content.trim(),
          });
        }
      }
    } catch (emailError) {
      console.error("Failed to send comment notification email:", emailError);
    }

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

export async function deleteBlogComment({ commentId }: { commentId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const userId = session.user.id;

  try {
    const comment = await db
      .select({
        id: blogComments.id,
        authorId: blogComments.authorId,
      })
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
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

    await db
      .update(blogComments)
      .set({ isDeleted: true })
      .where(eq(blogComments.id, commentId));

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

export async function toggleBlogCommentLike({
  commentId,
}: {
  commentId: string;
}) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized. Please sign in to like comments.",
    };
  }

  const userId = session.user.id;

  try {
    const existingLike = await db
      .select({ id: blogLikes.id })
      .from(blogLikes)
      .where(
        and(eq(blogLikes.userId, userId), eq(blogLikes.commentId, commentId))
      )
      .limit(1);

    if (existingLike.length > 0) {
      await db.delete(blogLikes).where(eq(blogLikes.id, existingLike[0].id));

      return {
        success: true,
        liked: false,
        message: "Comment unliked",
      };
    } else {
      await db.insert(blogLikes).values({
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

export async function checkBlogCommentLikeStatus({
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
      .select({ id: blogLikes.id })
      .from(blogLikes)
      .where(
        and(eq(blogLikes.userId, userId), eq(blogLikes.commentId, commentId))
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

export async function toggleBlogPostLike({ postId }: { postId: string }) {
  const session = await serverAuth();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized. Please sign in to like posts.",
    };
  }

  const userId = session.user.id;

  try {
    const existingLike = await db
      .select({ id: blogLikes.id })
      .from(blogLikes)
      .where(and(eq(blogLikes.userId, userId), eq(blogLikes.postId, postId)))
      .limit(1);

    if (existingLike.length > 0) {
      await db.delete(blogLikes).where(eq(blogLikes.id, existingLike[0].id));

      return {
        success: true,
        liked: false,
        message: "Post unliked",
      };
    } else {
      await db.insert(blogLikes).values({
        userId,
        postId,
      });

      try {
        const [post] = await db
          .select({
            id: blogPosts.id,
            slug: blogPosts.slug,
            title: blogPosts.title,
          })
          .from(blogPosts)
          .where(eq(blogPosts.id, postId))
          .limit(1);

        if (post) {
          const [liker] = await db
            .select({
              name: user.name,
              username: user.username,
            })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

          if (liker) {
            await notifyNewLike({
              postId: post.id,
              postSlug: post.slug,
              postTitle: post.title,
              likerName: liker.name || "Unknown User",
              likerUsername: liker.username || "unknown",
            });
          }
        }
      } catch (emailError) {
        console.error("Failed to send like notification email:", emailError);
      }

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

export async function checkBlogPostLikeStatus({ postId }: { postId: string }) {
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
      .select({ id: blogLikes.id })
      .from(blogLikes)
      .where(and(eq(blogLikes.userId, userId), eq(blogLikes.postId, postId)))
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

export async function createBlogShare({ postId }: { postId: string }) {
  try {
    const [post] = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
      })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1);

    if (!post) {
      return {
        success: false,
        message: "Blog post not found",
      };
    }

    await db.insert(blogShares).values({
      postId,
    });

    try {
      await notifyNewShare({
        postId: post.id,
        postSlug: post.slug,
        postTitle: post.title,
      });
    } catch (emailError) {
      console.error("Failed to send share notification email:", emailError);
    }

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
