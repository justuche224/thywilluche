import "server-only";
import db from "@/db";
import { blogPosts, blogCategories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type BlogCategory = (typeof blogCategories)[number];

export async function getPublishedBlogPosts(category?: string) {
  if (category && blogCategories.includes(category as BlogCategory)) {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, "published"),
          eq(blogPosts.category, category as BlogCategory)
        )
      )
      .orderBy(blogPosts.publishedAt);
  }

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(blogPosts.publishedAt);
}

export async function getBlogPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

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
