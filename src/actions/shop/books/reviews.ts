"use server";

import z from "zod";
import { eq, desc } from "drizzle-orm";
import { baseBook, bookReview } from "@/db/schema/books";
import { requireAdmin } from "@/lib/server-auth";
import { logger } from "@/utils/logger";
import db from "@/db";

const addReviewSchema = z.object({
  baseBookId: z.string().min(1),
  reviewerName: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(1),
  showOnHomePage: z.boolean().optional(),
});

const updateReviewSchema = z.object({
  id: z.string().min(1),
  reviewerName: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  content: z.string().min(1).optional(),
  showOnHomePage: z.boolean().optional(),
});

export const addBookReview = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to add a review.",
    };
  }

  const validatedFields = addReviewSchema.safeParse({
    baseBookId: formData.get("baseBookId"),
    reviewerName: formData.get("reviewerName"),
    rating: formData.get("rating")
      ? parseFloat(formData.get("rating") as string)
      : undefined,
    content: formData.get("content"),
    showOnHomePage: formData.get("showOnHomePage") === "true",
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const { baseBookId, reviewerName, rating, content, showOnHomePage } =
    validatedFields.data;

  try {
    const bookExists = await db
      .select()
      .from(baseBook)
      .where(eq(baseBook.id, baseBookId))
      .limit(1);

    if (!bookExists.length) {
      return {
        error: "Not found",
        message: "Book not found.",
      };
    }

    await db.insert(bookReview).values({
      baseBookId,
      reviewerName,
      rating: rating.toString(),
      content,
      showOnHomePage: showOnHomePage || false,
    });

    return {
      message: "Review added successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/reviews.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while adding the review.",
    };
  }
};

export const getBookReviews = async (baseBookId: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view reviews.",
    };
  }

  try {
    const reviews = await db
      .select()
      .from(bookReview)
      .where(eq(bookReview.baseBookId, baseBookId))
      .orderBy(desc(bookReview.createdAt));

    return {
      reviews: reviews.map((review) => ({
        ...review,
        rating: parseFloat(review.rating),
      })),
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/reviews.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching reviews.",
    };
  }
};

export const updateBookReview = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to update a review.",
    };
  }

  const validatedFields = updateReviewSchema.safeParse({
    id: formData.get("id"),
    reviewerName: formData.get("reviewerName"),
    rating: formData.get("rating")
      ? parseFloat(formData.get("rating") as string)
      : undefined,
    content: formData.get("content"),
    showOnHomePage: formData.get("showOnHomePage") === "true",
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const { id, reviewerName, rating, content, showOnHomePage } =
    validatedFields.data;

  try {
    const existingReview = await db
      .select()
      .from(bookReview)
      .where(eq(bookReview.id, id))
      .limit(1);

    if (!existingReview.length) {
      return {
        error: "Not found",
        message: "Review not found.",
      };
    }

    const updateData: Partial<typeof bookReview.$inferInsert> = {};
    if (reviewerName !== undefined) updateData.reviewerName = reviewerName;
    if (rating !== undefined) updateData.rating = rating.toString();
    if (content !== undefined) updateData.content = content;
    if (showOnHomePage !== undefined)
      updateData.showOnHomePage = showOnHomePage;

    if (Object.keys(updateData).length > 0) {
      await db.update(bookReview).set(updateData).where(eq(bookReview.id, id));
    }

    return {
      message: "Review updated successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/reviews.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while updating the review.",
    };
  }
};

export const deleteBookReview = async (reviewId: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to delete a review.",
    };
  }

  try {
    await db.delete(bookReview).where(eq(bookReview.id, reviewId));

    return {
      message: "Review deleted successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/reviews.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while deleting the review.",
    };
  }
};
