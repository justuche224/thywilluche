"use server";

import { eq, desc, and } from "drizzle-orm";
import { baseMerch, merchVariant } from "@/db/schema/merch";
import { logger } from "@/utils/logger";
import db from "@/db";

export const getPublicMerchWithVariants = async (
  page: number = 1,
  limit: number = 10
) => {
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
          .where(
            and(
              eq(merchVariant.baseMerchId, item.id),
              eq(merchVariant.isListed, true)
            )
          );

        return {
          ...item,
          variants,
        };
      })
    );

    const filteredMerch = merchWithVariants.filter(
      (item) => item.variants.length > 0
    );

    const totalMerch = await db
      .select()
      .from(baseMerch)
      .then((result) => result.length);
    const totalPages = Math.ceil(totalMerch / limit);

    return {
      merch: filteredMerch,
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
      "actions/shop/merch/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching merchandise.",
      merch: [],
      pagination: {
        page: 1,
        limit: 10,
        totalMerch: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
};

export const getPublicFeaturedMerch = async () => {
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
          .where(
            and(
              eq(merchVariant.baseMerchId, item.id),
              eq(merchVariant.isListed, true)
            )
          );

        return {
          ...item,
          variants,
        };
      })
    );

    const filteredMerch = merchWithVariants.filter(
      (item) => item.variants.length > 0
    );

    return {
      merch: filteredMerch,
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching featured merchandise.",
      merch: [],
    };
  }
};

export const getMerchBySlug = async (slug: string) => {
  try {
    const merchData = await db
      .select()
      .from(baseMerch)
      .where(eq(baseMerch.slug, slug))
      .limit(1);

    if (merchData.length === 0) {
      return {
        error: "Not found",
        message: "Merchandise not found.",
      };
    }

    const variants = await db
      .select()
      .from(merchVariant)
      .where(
        and(
          eq(merchVariant.baseMerchId, merchData[0].id),
          eq(merchVariant.isListed, true)
        )
      );

    if (variants.length === 0) {
      return {
        error: "Not found",
        message: "Merchandise not available.",
      };
    }

    return {
      merch: {
        ...merchData[0],
        variants,
      },
    };
  } catch (error) {
    logger(
      error instanceof Error ? error.message : "Unknown error",
      "error",
      "actions/shop/merch/public.ts"
    );
    return {
      error: "Internal server error",
      message: "An error occurred while fetching the merchandise.",
    };
  }
};
