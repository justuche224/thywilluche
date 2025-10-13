"use server";

import db from "@/db";
import {
  blogPosts,
  projects,
  testimonials,
  book,
  projectReviews,
  communityPosts,
  communityGroups,
  communityComments,
  communityLikes,
  communityShares,
  user,
} from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { serverAuth } from "@/lib/server-auth";

export async function getDashboardStats() {
  try {
    const auth = await serverAuth();

    if (!auth?.user || auth.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Get blog stats
    const blogPublished = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));

    const blogDrafts = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "draft"));

    const blogTotal = await db.select({ count: count() }).from(blogPosts);

    // Get project stats
    const projectsTotal = await db.select({ count: count() }).from(projects);

    // Get project reviews that need attention (not approved)
    const projectReviewsNeedingAttention = await db
      .select({ count: count() })
      .from(projectReviews)
      .where(eq(projectReviews.approved, false));

    // Get testimonial stats
    const testimonialsApproved = await db
      .select({ count: count() })
      .from(testimonials)
      .where(eq(testimonials.approved, true));

    const testimonialsPending = await db
      .select({ count: count() })
      .from(testimonials)
      .where(eq(testimonials.approved, false));

    const testimonialsTotal = await db
      .select({ count: count() })
      .from(testimonials);

    // Get books stats
    const booksTotal = await db.select({ count: count() }).from(book);

    // Count books that are sold out
    const booksSoldOut = await db
      .select({ count: count() })
      .from(book)
      .where(eq(book.status, "Sold Out"));

    // Get community stats
    const communityPostsTotal = await db
      .select({ count: count() })
      .from(communityPosts);
    const communityPostsPending = await db
      .select({ count: count() })
      .from(communityPosts)
      .where(eq(communityPosts.status, "pending"));
    const communityPostsApproved = await db
      .select({ count: count() })
      .from(communityPosts)
      .where(eq(communityPosts.status, "approved"));

    const communityGroupsTotal = await db
      .select({ count: count() })
      .from(communityGroups);
    const communityUsersTotal = await db.select({ count: count() }).from(user);
    const communityCommentsTotal = await db
      .select({ count: count() })
      .from(communityComments);
    const communityLikesTotal = await db
      .select({ count: count() })
      .from(communityLikes);
    const communitySharesTotal = await db
      .select({ count: count() })
      .from(communityShares);

    return {
      success: true,
      stats: {
        blog: {
          total: blogTotal[0]?.count || 0,
          published: blogPublished[0]?.count || 0,
          drafts: blogDrafts[0]?.count || 0,
        },
        projects: {
          total: projectsTotal[0]?.count || 0,
          needsReview: projectReviewsNeedingAttention[0]?.count || 0,
        },
        testimonials: {
          total: testimonialsTotal[0]?.count || 0,
          approved: testimonialsApproved[0]?.count || 0,
          pending: testimonialsPending[0]?.count || 0,
        },
        books: {
          total: booksTotal[0]?.count || 0,
          outOfStock: booksSoldOut[0]?.count || 0,
        },
        community: {
          posts: {
            total: communityPostsTotal[0]?.count || 0,
            pending: communityPostsPending[0]?.count || 0,
            approved: communityPostsApproved[0]?.count || 0,
          },
          groups: {
            total: communityGroupsTotal[0]?.count || 0,
          },
          users: {
            total: communityUsersTotal[0]?.count || 0,
          },
          engagement: {
            comments: communityCommentsTotal[0]?.count || 0,
            likes: communityLikesTotal[0]?.count || 0,
            shares: communitySharesTotal[0]?.count || 0,
          },
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard stats",
    };
  }
}
