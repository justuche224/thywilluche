"use server";

import db from "@/db";
import { testimonials } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type PublicTestimonial = {
  id: string;
  name: string;
  location: string | null;
  quote: string;
  rating: number;
  work: string | null;
};

export async function getApprovedTestimonials(): Promise<PublicTestimonial[]> {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(desc(testimonials.createdAt));

  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location ?? null,
    quote: t.quote,
    rating: t.rating,
    work: t.work ?? null,
  }));
}
