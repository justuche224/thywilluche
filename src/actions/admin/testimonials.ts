"use server";

import db from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/server-auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAllTestimonials = async () => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return { success: false, message: "Unauthorized" };
  }

  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));
  return { success: true, testimonials: rows };
};

export const getTestimonialById = async (id: string) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return { success: false, message: "Unauthorized" };
  }

  const [row] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  if (!row) return { success: false, message: "Not found" };
  return { success: true, testimonial: row };
};

export const createTestimonial = async (data: {
  name: string;
  location?: string | null;
  quote: string;
  rating?: number;
  work?: string | null;
  approved?: boolean;
}) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return { success: false, message: "Unauthorized" };
  }

  const [row] = await db
    .insert(testimonials)
    .values({
      name: data.name,
      location: data.location ?? null,
      quote: data.quote,
      rating: data.rating ?? 5,
      work: data.work ?? null,
      approved: data.approved ?? true,
    })
    .returning();

  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { success: true, testimonial: row };
};

export const updateTestimonial = async (
  id: string,
  data: {
    name?: string;
    location?: string | null;
    quote?: string;
    rating?: number;
    work?: string | null;
    approved?: boolean;
  }
) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return { success: false, message: "Unauthorized" };
  }

  const [row] = await db
    .update(testimonials)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();

  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { success: true, testimonial: row };
};

export const deleteTestimonial = async (id: string) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return { success: false, message: "Unauthorized" };
  }

  await db.delete(testimonials).where(eq(testimonials.id, id));

  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { success: true };
};

export const setTestimonialApproval = async (id: string, approved: boolean) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return { success: false, message: "Unauthorized" };
  }

  const [row] = await db
    .update(testimonials)
    .set({ approved, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();

  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { success: true, testimonial: row };
};
