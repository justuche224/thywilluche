"use server";

import db from "@/db";
import { projects, projectReviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export const getPublicProjects = async () => {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.date));

  return allProjects;
};

export const getPublicProjectById = async (id: string) => {
  const project = await db.select().from(projects).where(eq(projects.id, id));

  if (project.length === 0) {
    return null;
  }

  const reviews = await db
    .select()
    .from(projectReviews)
    .where(eq(projectReviews.projectId, id))
    .orderBy(desc(projectReviews.createdAt));

  return {
    ...project[0],
    reviews,
  };
};

export const submitReview = async (data: {
  projectId: string;
  author: string;
  content: string;
  rating: number;
}) => {
  if (!data.author || !data.content || !data.rating) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  if (data.rating < 1 || data.rating > 5) {
    return {
      success: false,
      message: "Rating must be between 1 and 5",
    };
  }

  const id = nanoid();

  await db.insert(projectReviews).values({
    id,
    projectId: data.projectId,
    author: data.author,
    content: data.content,
    rating: data.rating,
    approved: false,
  });

  revalidatePath(`/portfolio/${data.projectId}`);

  return {
    success: true,
    message:
      "Review submitted successfully. It will be visible after admin approval.",
  };
};
