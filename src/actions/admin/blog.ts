"use server";

import { requireAdmin } from "@/lib/server-auth";
import db from "@/db";
import { blogCategories, blogPosts, blogStatus } from "@/db/schema";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

export async function getAllBlogPosts() {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    throw new Error("Unauthorized");
  }

  return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
}

export async function getBlogPostById(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    throw new Error("Unauthorized");
  }

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  return post;
}

export async function createBlogPost(formData: FormData) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get(
      "category"
    ) as (typeof blogCategories)[number];
    const tagsString = formData.get("tags") as string;
    const tags = tagsString
      ? tagsString.split(",").map((tag) => tag.trim())
      : [];
    const imageFile = formData.get("image") as File | null;
    const contentString = formData.get("content") as string;
    const status = formData.get("status") as (typeof blogStatus)[number];
    const isFeatured = formData.get("isFeatured") === "true";

    if (!title || !excerpt || !category || !contentString) {
      return {
        success: false,
        message: "Title, excerpt, category, and content are required",
      };
    }

    const content = JSON.parse(contentString);
    const slug = slugify(title);

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, "blog");
    }

    const [newPost] = await db
      .insert(blogPosts)
      .values({
        title,
        slug,
        excerpt,
        category,
        tags,
        imageUrl,
        content,
        status,
        isFeatured,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return {
      success: true,
      message: "Blog post created successfully",
      post: newPost,
    };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return {
      success: false,
      message: "Failed to create blog post",
    };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get(
      "category"
    ) as (typeof blogCategories)[number];
    const tagsString = formData.get("tags") as string;
    const tags = tagsString
      ? tagsString.split(",").map((tag) => tag.trim())
      : [];
    const imageFile = formData.get("image") as File | null;
    const existingImageUrl = formData.get("existingImageUrl") as string;
    const contentString = formData.get("content") as string;
    const status = formData.get("status") as (typeof blogStatus)[number];
    const isFeatured = formData.get("isFeatured") === "true";

    if (!title || !excerpt || !category || !contentString) {
      return {
        success: false,
        message: "Title, excerpt, category, and content are required",
      };
    }

    const content = JSON.parse(contentString);
    const slug = slugify(title);

    let imageUrl = existingImageUrl;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, "blog");
    }

    const [existingPost] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    const publishedAt =
      status === "published" && !existingPost.publishedAt
        ? new Date()
        : existingPost.publishedAt;

    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        title,
        slug,
        excerpt,
        category,
        tags,
        imageUrl,
        content,
        status,
        isFeatured,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return {
      success: true,
      message: "Blog post updated successfully",
      post: updatedPost,
    };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return {
      success: false,
      message: "Failed to update blog post",
    };
  }
}

export async function deleteBlogPost(id: string) {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return {
      success: true,
      message: "Blog post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return {
      success: false,
      message: "Failed to delete blog post",
    };
  }
}
