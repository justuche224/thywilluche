"use server";

import z from "zod";
import { eq, desc, and } from "drizzle-orm";
import { baseMerch, merchVariant, variant, status } from "@/db/schema/merch";
import { uploadFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/slugify";
import { logger } from "@/utils/logger";
import db from "@/db";

const addMerchSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  variant: z.enum(variant),
  status: z.enum(status),
  isListed: z.boolean(),
  badge: z.string().optional(),
  price: z.number().min(0),
  slashedFrom: z.number().optional(),
  tags: z.array(z.string()).optional(),
  image: z.instanceof(File),
});

const addVariantSchema = z.object({
  baseMerchId: z.string(),
  variant: z.enum(variant),
  status: z.enum(status),
  isListed: z.boolean(),
  price: z.number().min(0),
  slashedFrom: z.number().optional(),
  image: z.instanceof(File),
  externalLinks: z.string().optional(),
});

export const addMerchWithVariant = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to add merchandise.",
    };
  }

  const validatedFields = addMerchSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
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
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const {
    name,
    description,
    variant: variantType,
    status: variantStatus,
    isListed,
    badge,
    price,
    slashedFrom,
    tags,
    image,
  } = validatedFields.data;

  const existingBaseMerch = await db
    .select()
    .from(baseMerch)
    .where(eq(baseMerch.name, name))
    .limit(1);

  if (existingBaseMerch.length > 0) {
    const existingVariant = await db
      .select()
      .from(merchVariant)
      .where(
        and(
          eq(merchVariant.baseMerchId, existingBaseMerch[0].id),
          eq(merchVariant.variant, variantType)
        )
      )
      .limit(1);

    if (existingVariant.length > 0) {
      return {
        error: "Duplicate merchandise variant",
        message: `A ${variantType} version of "${name}" already exists. Please choose a different variant.`,
      };
    }
  }

  const imageUrl = await uploadFile(image, "merch-image");
  const slug = slugify(name);

  try {
    await db.transaction(async (tx) => {
      let merchId: string;

      if (existingBaseMerch.length > 0) {
        merchId = existingBaseMerch[0].id;
      } else {
        const [insertedBaseMerch] = await tx
          .insert(baseMerch)
          .values({
            name,
            slug,
            description,
            tags: tags || [],
            badge,
          })
          .returning();

        merchId = insertedBaseMerch.id;
      }

      await tx.insert(merchVariant).values({
        baseMerchId: merchId,
        variant: variantType,
        status: variantStatus,
        isListed,
        price: price.toString(),
        slashedFrom: slashedFrom?.toString(),
        imageUrl,
      });
    });

    return {
      message: "Merchandise added successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while adding the merchandise.",
    };
  }
};

export const addVariantToMerch = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to add a variant.",
    };
  }

  const validatedFields = addVariantSchema.safeParse({
    baseMerchId: formData.get("baseMerchId"),
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
    baseMerchId,
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
    .from(merchVariant)
    .where(
      and(
        eq(merchVariant.baseMerchId, baseMerchId),
        eq(merchVariant.variant, variantType)
      )
    )
    .limit(1);

  if (existingVariant.length > 0) {
    return {
      error: "Duplicate variant",
      message: `A ${variantType} version already exists for this merchandise.`,
    };
  }

  const imageUrl = await uploadFile(image, "merch-image");

  try {
    await db.insert(merchVariant).values({
      baseMerchId,
      variant: variantType,
      status: variantStatus,
      isListed,
      price: price.toString(),
      slashedFrom: slashedFrom?.toString(),
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
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while adding the variant.",
    };
  }
};

export const getMerchWithVariants = async (
  page: number = 1,
  limit: number = 10
) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view merchandise.",
    };
  }

  try {
    const offset = (page - 1) * limit;

    const merch = await db
      .select()
      .from(baseMerch)
      .orderBy(desc(baseMerch.createdAt))
      .limit(limit)
      .offset(offset);

    const merchWithVariants = await Promise.all(
      merch.map(async (item) => {
        const variants = await db
          .select()
          .from(merchVariant)
          .where(eq(merchVariant.baseMerchId, item.id));

        return {
          ...item,
          variants,
        };
      })
    );

    const totalMerch = await db
      .select()
      .from(baseMerch)
      .then((result) => result.length);
    const totalPages = Math.ceil(totalMerch / limit);

    return {
      merch: merchWithVariants,
      pagination: {
        page,
        limit,
        totalMerch,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching merchandise.",
    };
  }
};

export const getBaseMerch = async (id: string) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view this merchandise.",
    };
  }

  try {
    const merchData = await db
      .select()
      .from(baseMerch)
      .where(eq(baseMerch.id, id))
      .limit(1);

    if (!merchData.length) {
      return {
        error: "Not found",
        message: "Merchandise not found.",
      };
    }

    const variants = await db
      .select()
      .from(merchVariant)
      .where(eq(merchVariant.baseMerchId, id));

    return {
      merch: merchData[0],
      variants,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the merchandise.",
    };
  }
};

const updateBaseMerchSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateBaseMerch = async (formData: FormData) => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to update merchandise.",
    };
  }

  const validatedFields = updateBaseMerchSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    badge: formData.get("badge"),
    isFeatured: formData.get("isFeatured")
      ? formData.get("isFeatured") === "true"
      : undefined,
    featuredOrder: formData.get("featuredOrder")
      ? parseInt(formData.get("featuredOrder") as string)
      : undefined,
    tags: formData.getAll("tags"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: "Invalid fields",
      message: "Please check your input and try again.",
    };
  }

  const { id, name, description, badge, isFeatured, featuredOrder, tags } =
    validatedFields.data;

  try {
    const updateData: Partial<typeof baseMerch.$inferInsert> = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (description !== undefined) updateData.description = description;
    if (badge !== undefined) updateData.badge = badge;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (featuredOrder !== undefined) updateData.featuredOrder = featuredOrder;
    if (tags !== undefined) updateData.tags = tags;

    if (Object.keys(updateData).length > 0) {
      await db.update(baseMerch).set(updateData).where(eq(baseMerch.id, id));
    }

    return {
      message: "Merchandise updated successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while updating the merchandise.",
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

export const updateMerchVariant = async (formData: FormData) => {
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
    const updateData: Partial<typeof merchVariant.$inferInsert> = {};

    if (variantStatus !== undefined) updateData.status = variantStatus;
    if (isListed !== undefined) updateData.isListed = isListed;
    if (price !== undefined) updateData.price = price.toString();
    if (slashedFrom !== undefined)
      updateData.slashedFrom = slashedFrom.toString();
    if (externalLinks !== undefined)
      updateData.externalLinks = externalLinks || null;

    if (image && image.size > 0) {
      const imageUrl = await uploadFile(image, "merch-image");
      updateData.imageUrl = imageUrl;
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(merchVariant)
        .set(updateData)
        .where(eq(merchVariant.id, id));
    }

    return {
      message: "Variant updated successfully",
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while updating the variant.",
    };
  }
};

export const getMerchVariant = async (id: string) => {
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
      .from(merchVariant)
      .where(eq(merchVariant.id, id))
      .limit(1);

    if (!variantData.length) {
      return {
        error: "Not found",
        message: "Variant not found.",
      };
    }

    const merchData = await db
      .select()
      .from(baseMerch)
      .where(eq(baseMerch.id, variantData[0].baseMerchId))
      .limit(1);

    return {
      variant: variantData[0],
      merch: merchData[0],
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the variant.",
    };
  }
};

export const getFeaturedMerch = async () => {
  const isPermitted = await requireAdmin();

  if (!isPermitted) {
    return {
      error: "Unauthorized",
      message: "You are not authorized to view featured merchandise.",
    };
  }

  try {
    const merch = await db
      .select()
      .from(baseMerch)
      .where(eq(baseMerch.isFeatured, true))
      .orderBy(desc(baseMerch.featuredOrder));

    const merchWithVariants = await Promise.all(
      merch.map(async (item) => {
        const variants = await db
          .select()
          .from(merchVariant)
          .where(eq(merchVariant.baseMerchId, item.id));

        return {
          ...item,
          variants,
        };
      })
    );

    return {
      merch: merchWithVariants,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/admin-new.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching featured merchandise.",
    };
  }
};
