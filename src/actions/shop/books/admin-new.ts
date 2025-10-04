"use server";

import z from "zod";
import { eq, desc, and } from "drizzle-orm";
import {
  baseBook,
  bookVariant,
  trope as tropeTable,
  variant,
  status,
} from "@/db/schema/books";
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

const addVariantSchema = z.object({
  baseBookId: z.string(),
  variant: z.enum(variant),
  status: z.enum(status),
  isListed: z.boolean(),
  price: z.number().min(0),
  slashedFrom: z.number().optional(),
  image: z.instanceof(File),
  externalLinks: z.string().optional(),
});

export const addBookWithVariant = async (formData: FormData) => {
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
    variant: variantType,
    status: variantStatus,
    isListed,
    badge,
    price,
    slashedFrom,
    tags,
    image,
    trope,
  } = validatedFields.data;

  const existingBaseBook = await db
    .select()
    .from(baseBook)
    .where(eq(baseBook.tittle, tittle))
    .limit(1);

  if (existingBaseBook.length > 0) {
    const existingVariant = await db
      .select()
      .from(bookVariant)
      .where(
        and(
          eq(bookVariant.baseBookId, existingBaseBook[0].id),
          eq(bookVariant.variant, variantType)
        )
      )
      .limit(1);

    if (existingVariant.length > 0) {
      return {
        error: "Duplicate book variant",
        message: `A ${variantType} version of "${tittle}" already exists. Please choose a different variant.`,
      };
    }
  }

  const imageUrl = await uploadFile(image, "book-cover");
  const slug = slugify(tittle);

  try {
    await db.transaction(async (tx) => {
      let bookId: string;

      if (existingBaseBook.length > 0) {
        bookId = existingBaseBook[0].id;
      } else {
        const [insertedBaseBook] = await tx
          .insert(baseBook)
          .values({
            tittle,
            slug,
            seriesId,
            releaseDate,
            synopsis,
            tags: tags || [],
            badge,
          })
          .returning();

        bookId = insertedBaseBook.id;

        if (trope && trope.length > 0) {
          const tropeValues = trope.map((tropeName) => ({
            name: tropeName,
            slug: slugify(tropeName),
            baseBookId: bookId,
          }));

          await tx.insert(tropeTable).values(tropeValues);
        }
      }

      await tx.insert(bookVariant).values({
        baseBookId: bookId,
        variant: variantType,
        status: variantStatus,
        isListed,
        price,
        slashedFrom,
        imageUrl,
      });
    });

    return {
      message: "Book added successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while adding the book.",
    };
  }
};

export const addVariantToBook = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to add a variant.",
    };
  }

  const validatedFields = addVariantSchema.safeParse({
    baseBookId: formData.get("baseBookId"),
    variant: formData.get("variant"),
    status: formData.get("status"),
    isListed: formData.get("isListed") === "true",
    price: parseFloat(formData.get("price") as string),
    slashedFrom: formData.get("slashedFrom")
      ? parseFloat(formData.get("slashedFrom") as string)
      : undefined,
    image: formData.get("image"),
    externalLinks: formData.get("externalLinks") as string | undefined,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const {
    baseBookId,
    variant: variantType,
    status: variantStatus,
    isListed,
    price,
    slashedFrom,
    image,
    externalLinks,
  } = validatedFields.data;

  const existingVariant = await db
    .select()
    .from(bookVariant)
    .where(
      and(
        eq(bookVariant.baseBookId, baseBookId),
        eq(bookVariant.variant, variantType)
      )
    )
    .limit(1);

  if (existingVariant.length > 0) {
    return {
      error: "Duplicate variant",
      message: `A ${variantType} version already exists for this book.`,
    };
  }

  const imageUrl = await uploadFile(image, "book-cover");

  try {
    await db.insert(bookVariant).values({
      baseBookId,
      variant: variantType,
      status: variantStatus,
      isListed,
      price,
      slashedFrom,
      imageUrl,
      externalLinks: externalLinks || null,
    });

    return {
      message: "Variant added successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while adding the variant.",
    };
  }
};

export const getBooksWithVariants = async (
  page: number = 1,
  limit: number = 10
) => {
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
      .from(baseBook)
      .orderBy(desc(baseBook.createdAt))
      .limit(limit)
      .offset(offset);

    const booksWithVariants = await Promise.all(
      books.map(async (book) => {
        const variants = await db
          .select()
          .from(bookVariant)
          .where(eq(bookVariant.baseBookId, book.id));

        const tropes = await db
          .select()
          .from(tropeTable)
          .where(eq(tropeTable.baseBookId, book.id));

        return {
          ...book,
          variants,
          tropes,
        };
      })
    );

    const totalBooks = await db
      .select()
      .from(baseBook)
      .then((result) => result.length);
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      books: booksWithVariants,
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
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching books.",
    };
  }
};

export const getBaseBook = async (id: string) => {
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
      .from(baseBook)
      .where(eq(baseBook.id, id))
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
      .where(eq(bookVariant.baseBookId, id));

    const tropes = await db
      .select()
      .from(tropeTable)
      .where(eq(tropeTable.baseBookId, id));

    return {
      book: bookData[0],
      variants,
      tropes,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the book.",
    };
  }
};

const updateBaseBookSchema = z.object({
  id: z.string(),
  tittle: z.string().min(1).optional(),
  seriesId: z.string().optional(),
  releaseDate: z.date().optional(),
  synopsis: z.string().min(1).optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().optional(),
  tags: z.array(z.string()).optional(),
  trope: z.array(z.string()).optional(),
});

export const updateBaseBook = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to update a book.",
    };
  }

  const validatedFields = updateBaseBookSchema.safeParse({
    id: formData.get("id"),
    tittle: formData.get("tittle"),
    seriesId: formData.get("seriesId"),
    releaseDate: formData.get("releaseDate")
      ? new Date(formData.get("releaseDate") as string)
      : undefined,
    synopsis: formData.get("synopsis"),
    badge: formData.get("badge"),
    isFeatured: formData.get("isFeatured")
      ? formData.get("isFeatured") === "true"
      : undefined,
    featuredOrder: formData.get("featuredOrder")
      ? parseInt(formData.get("featuredOrder") as string)
      : undefined,
    tags: formData.getAll("tags"),
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
    badge,
    isFeatured,
    featuredOrder,
    tags,
    trope,
  } = validatedFields.data;

  try {
    await db.transaction(async (tx) => {
      const updateData: Partial<typeof baseBook.$inferInsert> = {};
      if (tittle !== undefined) {
        updateData.tittle = tittle;
        updateData.slug = slugify(tittle);
      }
      if (seriesId !== undefined) updateData.seriesId = seriesId;
      if (releaseDate !== undefined) updateData.releaseDate = releaseDate;
      if (synopsis !== undefined) updateData.synopsis = synopsis;
      if (badge !== undefined) updateData.badge = badge;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (featuredOrder !== undefined) updateData.featuredOrder = featuredOrder;
      if (tags !== undefined) updateData.tags = tags;

      if (Object.keys(updateData).length > 0) {
        await tx.update(baseBook).set(updateData).where(eq(baseBook.id, id));
      }

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
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while updating the book.",
    };
  }
};

const updateVariantSchema = z.object({
  id: z.string(),
  status: z.enum(status).optional(),
  isListed: z.boolean().optional(),
  price: z.number().min(0).optional(),
  slashedFrom: z.number().optional(),
  image: z.instanceof(File).optional(),
  externalLinks: z.string().optional(),
});

export const updateBookVariant = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to update a variant.",
    };
  }

  const validatedFields = updateVariantSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    isListed: formData.get("isListed")
      ? formData.get("isListed") === "true"
      : undefined,
    price: formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : undefined,
    slashedFrom: formData.get("slashedFrom")
      ? parseFloat(formData.get("slashedFrom") as string)
      : undefined,
    image: formData.get("image"),
    externalLinks: formData.get("externalLinks") as string | undefined,
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
    status: variantStatus,
    isListed,
    price,
    slashedFrom,
    image,
    externalLinks,
  } = validatedFields.data;

  try {
    const updateData: Partial<typeof bookVariant.$inferInsert> = {};

    if (variantStatus !== undefined) updateData.status = variantStatus;
    if (isListed !== undefined) updateData.isListed = isListed;
    if (price !== undefined) updateData.price = price;
    if (slashedFrom !== undefined) updateData.slashedFrom = slashedFrom;
    if (externalLinks !== undefined)
      updateData.externalLinks = externalLinks || null;

    if (image && image.size > 0) {
      const imageUrl = await uploadFile(image, "book-cover");
      updateData.imageUrl = imageUrl;
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(bookVariant)
        .set(updateData)
        .where(eq(bookVariant.id, id));
    }

    return {
      message: "Variant updated successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while updating the variant.",
    };
  }
};

export const getBookVariant = async (id: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view this variant.",
    };
  }

  try {
    const variantData = await db
      .select()
      .from(bookVariant)
      .where(eq(bookVariant.id, id))
      .limit(1);

    if (!variantData.length) {
      return {
        error: "Not found",
        message: "Variant not found.",
      };
    }

    const bookData = await db
      .select()
      .from(baseBook)
      .where(eq(baseBook.id, variantData[0].baseBookId))
      .limit(1);

    return {
      variant: variantData[0],
      book: bookData[0],
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the variant.",
    };
  }
};

export const getFeaturedBooks = async () => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view featured books.",
    };
  }

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
          .where(eq(bookVariant.baseBookId, book.id));

        return {
          ...book,
          variants,
        };
      })
    );

    return {
      books: booksWithVariants,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/books/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching featured books.",
    };
  }
};
