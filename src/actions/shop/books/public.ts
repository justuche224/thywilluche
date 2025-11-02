"use server";

import { eq, desc, and, asc } from "drizzle-orm";
import { baseBook, bookVariant, trope, bookReview } from "@/db/schema/books";
import { logger } from "@/utils/logger";
import db from "@/db";

export const getPublicBooksWithVariants = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    const offset = (page - 1) * limit;

    const books = await db
      .select()
      .from(baseBook)
      .orderBy(desc(baseBook.createdAt))
      .limit(limit)
      .offset(offset);

    const booksWithVariants = await Promise.all(
      books.map(async (book) => {
        const variants = await db
          .select()
          .from(bookVariant)
          .where(
            and(
              eq(bookVariant.baseBookId, book.id),
              eq(bookVariant.isListed, true)
            )
          );

        const reviews = await db
          .select()
          .from(bookReview)
          .where(eq(bookReview.baseBookId, book.id));

        const reviewStats =
          reviews.length > 0
            ? {
                count: reviews.length,
                averageRating:
                  Math.round(
                    (reviews.reduce(
                      (sum, review) => sum + parseFloat(review.rating),
                      0
                    ) /
                      reviews.length) *
                      10
                  ) / 10,
              }
            : { count: 0, averageRating: 0 };

        return {
          ...book,
          variants,
          reviewStats,
        };
      })
    );

    const filteredBooks = booksWithVariants.filter(
      (book) => book.variants.length > 0
    );

    const totalBooks = await db
      .select()
      .from(baseBook)
      .then((result) => result.length);
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      books: filteredBooks,
      pagination: {
        page,
        limit,
        totalBooks,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching books.",
      books: [],
      pagination: {
        page: 1,
        limit: 10,
        totalBooks: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
};

export const getPublicFeaturedBooks = async () => {
  try {
    const books = await db
      .select()
      .from(baseBook)
      .where(eq(baseBook.isFeatured, true))
      .orderBy(desc(baseBook.featuredOrder));

    const booksWithVariants = await Promise.all(
      books.map(async (book) => {
        const variants = await db
          .select()
          .from(bookVariant)
          .where(
            and(
              eq(bookVariant.baseBookId, book.id),
              eq(bookVariant.isListed, true)
            )
          );

        const reviews = await db
          .select()
          .from(bookReview)
          .where(eq(bookReview.baseBookId, book.id));

        const reviewStats =
          reviews.length > 0
            ? {
                count: reviews.length,
                averageRating:
                  Math.round(
                    (reviews.reduce(
                      (sum, review) => sum + parseFloat(review.rating),
                      0
                    ) /
                      reviews.length) *
                      10
                  ) / 10,
              }
            : { count: 0, averageRating: 0 };

        return {
          ...book,
          variants,
          reviewStats,
        };
      })
    );

    const filteredBooks = booksWithVariants.filter(
      (book) => book.variants.length > 0
    );

    return {
      books: filteredBooks,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching featured books.",
      books: [],
    };
  }
};

export const getPublicBookBySlug = async (slug: string) => {
  try {
    const bookData = await db
      .select()
      .from(baseBook)
      .where(eq(baseBook.slug, slug))
      .limit(1);

    if (!bookData.length) {
      return {
        error: "Not found",
        message: "Book not found.",
      };
    }

    const variants = await db
      .select()
      .from(bookVariant)
      .where(
        and(
          eq(bookVariant.baseBookId, bookData[0].id),
          eq(bookVariant.isListed, true)
        )
      );

    if (variants.length === 0) {
      return {
        error: "Not found",
        message: "Book not available.",
      };
    }

    return {
      book: bookData[0],
      variants,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the book.",
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    const bookData = await db
      .select()
      .from(baseBook)
      .where(eq(baseBook.slug, slug))
      .limit(1);

    if (bookData.length === 0) {
      return {
        error: "Not found",
        message: "Book not found.",
      };
    }

    const variants = await db
      .select()
      .from(bookVariant)
      .where(
        and(
          eq(bookVariant.baseBookId, bookData[0].id),
          eq(bookVariant.isListed, true)
        )
      );

    const tropes = await db
      .select()
      .from(trope)
      .where(eq(trope.baseBookId, bookData[0].id));

    if (variants.length === 0) {
      return {
        error: "Not found",
        message: "Book not available.",
      };
    }

    return {
      book: {
        ...bookData[0],
        variants,
        tropes,
      },
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the book.",
    };
  }
};

export const getPublicBookReviews = async (baseBookId: string) => {
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
      "actions/shop/books/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching reviews.",
      reviews: [],
    };
  }
};

export const getPublicBookReviewStats = async (baseBookId: string) => {
  try {
    const reviews = await db
      .select()
      .from(bookReview)
      .where(eq(bookReview.baseBookId, baseBookId));

    if (reviews.length === 0) {
      return {
        count: 0,
        averageRating: 0,
      };
    }

    const ratings = reviews.map((review) => parseFloat(review.rating));
    const averageRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    return {
      count: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/public.ts"
    );
    return {
      count: 0,
      averageRating: 0,
    };
  }
};

export const getHomePageReviews = async () => {
  // console.log("getHomePageReviews");
  try {
    const homeReviews = await db
      .select()
      .from(bookReview)
      .where(eq(bookReview.showOnHomePage, true))
      .orderBy(asc(bookReview.createdAt))
      .limit(10);

      // console.log(homeReviews[0]);
    return {
      reviews: homeReviews.map((review) => ({
        ...review,
        rating: parseFloat(review.rating),
      })),
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/public.ts"
    );
    return {
      reviews: [],
    };
  }
};
