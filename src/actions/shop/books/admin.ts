"use server";

import z from "zod";
import { eq, desc, and, ilike, ne } from "drizzle-orm";
import { book, trope as tropeTable, variant } from "@/db/schema/books";
import { status } from "@/db/schema/books";
import { uploadFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/slugify";
import { logger } from "@/utils/logger";
import db from "@/db";

const addBookSchema = z.object({
  tittle: z.string().min(1),
  seriesId: z.string().optional(),
  releaseDate: z.date(),
  synopsis: z.string().min(1),
  variant: z.enum(variant),
  status: z.enum(status),
  isListed: z.boolean(),
  badge: z.string().optional(),
  price: z.number().min(0),
  slashedFrom: z.number().optional(),
  tags: z.array(z.string()).optional(),
  image: z.instanceof(File),
  trope: z.array(z.string()).optional(),
});

const updateBookSchema = z.object({
  id: z.string(),
  tittle: z.string().min(1).optional(),
  seriesId: z.string().optional(),
  releaseDate: z.date().optional(),
  synopsis: z.string().min(1).optional(),
  variant: z.enum(variant).optional(),
  status: z.enum(status).optional(),
  isListed: z.boolean().optional(),
  badge: z.string().optional(),
  price: z.number().min(0).optional(),
  slashedFrom: z.number().optional(),
  tags: z.array(z.string()).optional(),
  image: z.instanceof(File).optional(),
  trope: z.array(z.string()).optional(),
});

export const addBook = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to add a book.",
    };
  }

  const validatedFields = addBookSchema.safeParse({
    tittle: formData.get("tittle"),
    seriesId: formData.get("seriesId"),
    releaseDate: new Date(formData.get("releaseDate") as string),
    synopsis: formData.get("synopsis"),
    variant: formData.get("variant"),
    status: formData.get("status"),
    isListed: formData.get("isListed") === "true",
    badge: formData.get("badge"),
    price: parseFloat(formData.get("price") as string),
    slashedFrom: formData.get("slashedFrom")
      ? parseFloat(formData.get("slashedFrom") as string)
      : undefined,
    tags: formData.getAll("tags"),
    image: formData.get("image"),
    trope: formData.getAll("trope"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const {
    tittle,
    seriesId,
    releaseDate,
    synopsis,
    variant,
    status,
    isListed,
    badge,
    price,
    slashedFrom,
    tags,
    image,
    trope,
  } = validatedFields.data;

  const existingBook = await db
    .select()
    .from(book)
    .where(and(eq(book.tittle, tittle), eq(book.variant, variant)))
    .limit(1);

  if (existingBook.length > 0) {
    return {
      error: "Duplicate book variant",
      message: `A ${variant} version of "${tittle}" already exists. Please choose a different variant or update the existing book.`,
    };
  }

  const imageUrl = await uploadFile(image, "book-cover");

  const slug = slugify(tittle);

  try {
    await db.transaction(async (tx) => {
      const [insertedBook] = await tx
        .insert(book)
        .values({
          tittle,
          slug,
          seriesId,
          releaseDate,
          synopsis,
          variant,
          status,
          isListed,
          badge,
          price,
          slashedFrom,
          tags,
          imageUrl,
        })
        .returning();

      if (trope && trope.length > 0) {
        const tropeValues = trope.map((tropeName) => ({
          name: tropeName,
          slug: slugify(tropeName),
          baseBookId: insertedBook.id,
        }));

        await tx.insert(tropeTable).values(tropeValues);
      }
    });

    return {
      message: "Book added successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while adding the book.",
    };
  }
};

export const updateBook = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to update a book.",
    };
  }

  const validatedFields = updateBookSchema.safeParse({
    id: formData.get("id"),
    tittle: formData.get("tittle"),
    seriesId: formData.get("seriesId"),
    releaseDate: formData.get("releaseDate")
      ? new Date(formData.get("releaseDate") as string)
      : undefined,
    synopsis: formData.get("synopsis"),
    variant: formData.get("variant"),
    status: formData.get("status"),
    isListed: formData.get("isListed")
      ? formData.get("isListed") === "true"
      : undefined,
    badge: formData.get("badge"),
    price: formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : undefined,
    slashedFrom: formData.get("slashedFrom")
      ? parseFloat(formData.get("slashedFrom") as string)
      : undefined,
    tags: formData.getAll("tags"),
    image: formData.get("image"),
    trope: formData.getAll("trope"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const {
    id,
    tittle,
    seriesId,
    releaseDate,
    synopsis,
    variant,
    status,
    isListed,
    badge,
    price,
    slashedFrom,
    tags,
    image,
    trope,
  } = validatedFields.data;

  if (tittle || variant) {
    const checkTitle = tittle || undefined;
    const checkVariant = variant || undefined;

    if (checkTitle && checkVariant) {
      const existingBook = await db
        .select()
        .from(book)
        .where(
          and(
            eq(book.tittle, checkTitle),
            eq(book.variant, checkVariant),
            ne(book.id, id)
          )
        )
        .limit(1);

      if (existingBook.length > 0) {
        return {
          error: "Duplicate book variant",
          message: `A ${checkVariant} version of "${checkTitle}" already exists. Please choose a different variant or title.`,
        };
      }
    }
  }

  let imageUrl: string | undefined = undefined;
  if (image) {
    imageUrl = await uploadFile(image, "book-cover");
  }

  const slug = tittle ? slugify(tittle) : undefined;

  try {
    await db.transaction(async (tx) => {
      const updateData: Partial<typeof book.$inferInsert> = {};
      if (tittle !== undefined) updateData.tittle = tittle;
      if (slug !== undefined) updateData.slug = slug;
      if (seriesId !== undefined) updateData.seriesId = seriesId;
      if (releaseDate !== undefined) updateData.releaseDate = releaseDate;
      if (synopsis !== undefined) updateData.synopsis = synopsis;
      if (variant !== undefined) updateData.variant = variant;
      if (status !== undefined) updateData.status = status;
      if (isListed !== undefined) updateData.isListed = isListed;
      if (badge !== undefined) updateData.badge = badge;
      if (price !== undefined) updateData.price = price;
      if (slashedFrom !== undefined) updateData.slashedFrom = slashedFrom;
      if (tags !== undefined) updateData.tags = tags;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      if (Object.keys(updateData).length > 0) {
        await tx.update(book).set(updateData).where(eq(book.id, id));
      }

      // Handle tropes - delete existing and insert new ones
      if (trope !== undefined) {
        await tx.delete(tropeTable).where(eq(tropeTable.baseBookId, id));

        if (trope.length > 0) {
          const tropeValues = trope.map((tropeName) => ({
            name: tropeName,
            slug: slugify(tropeName),
            baseBookId: id,
          }));
          await tx.insert(tropeTable).values(tropeValues);
        }
      }
    });

    return {
      message: "Book updated successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while updating the book.",
    };
  }
};

export const deleteBook = async (id: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to delete a book.",
    };
  }

  try {
    await db.delete(book).where(eq(book.id, id));

    return {
      message: "Book deleted successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while deleting the book.",
    };
  }
};

export const getBooks = async (page: number = 1, limit: number = 10) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view books.",
    };
  }

  try {
    const offset = (page - 1) * limit;

    const books = await db
      .select()
      .from(book)
      .orderBy(desc(book.createdAt))
      .limit(limit)
      .offset(offset);

    const totalBooks = await db
      .select()
      .from(book)
      .then((result) => result.length);
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      books,
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
      "actions/shop/books/admin.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching books.",
    };
  }
};

export const getBook = async (id: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view this book.",
    };
  }

  try {
    const bookData = await db
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!bookData.length) {
      return {
        error: "Not found",
        message: "Book not found.",
      };
    }

    const tropes = await db
      .select()
      .from(tropeTable)
      .where(eq(tropeTable.baseBookId, id));

    return {
      book: bookData[0],
      tropes,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the book.",
    };
  }
};

export const searchBooks = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to search books.",
    };
  }

  try {
    const offset = (page - 1) * limit;
    const searchTerm = `%${query}%`;

    const books = await db
      .select()
      .from(book)
      .where(and(ilike(book.tittle, searchTerm)))
      .orderBy(desc(book.createdAt))
      .limit(limit)
      .offset(offset);

    const totalBooks = await db
      .select()
      .from(book)
      .where(and(ilike(book.tittle, searchTerm)))
      .then((result) => result.length);
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      books,
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
      "actions/shop/books/admin.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while searching books.",
    };
  }
};
