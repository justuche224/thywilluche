"use server";

import db from "@/db";
import { projects, projectReviews } from "@/db/schema";
import { requireAdmin } from "@/lib/server-auth";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export const getAllProjects = async () => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return {
    success: true,
    projects: allProjects,
  };
};

export const getProjectById = async (id: string) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  const project = await db.select().from(projects).where(eq(projects.id, id));

  if (project.length === 0) {
    return {
      success: false,
      message: "Project not found",
    };
  }

  return {
    success: true,
    project: project[0],
  };
};

export const createProject = async (data: {
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  downloadableExcerpt?: string;
  externalLink?: string;
  date: Date;
  featured?: boolean;
}) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const id = nanoid();

  await db.insert(projects).values({
    id,
    ...data,
  });

  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");

  return {
    success: true,
    message: "Project created successfully",
    projectId: id,
  };
};

export const updateProject = async (
  id: string,
  data: {
    title?: string;
    category?: string;
    description?: string;
    longDescription?: string;
    mediaType?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    downloadableExcerpt?: string;
    externalLink?: string;
    date?: Date;
    featured?: boolean;
  }
) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${id}`);
  revalidatePath("/admin/projects");

  return {
    success: true,
    message: "Project updated successfully",
  };
};

export const deleteProject = async (id: string) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");

  return {
    success: true,
    message: "Project deleted successfully",
  };
};

export const getAllReviews = async () => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  const allReviews = await db
    .select({
      id: projectReviews.id,
      projectId: projectReviews.projectId,
      projectTitle: projects.title,
      author: projectReviews.author,
      content: projectReviews.content,
      rating: projectReviews.rating,
      approved: projectReviews.approved,
      createdAt: projectReviews.createdAt,
    })
    .from(projectReviews)
    .leftJoin(projects, eq(projectReviews.projectId, projects.id))
    .orderBy(desc(projectReviews.createdAt));

  return {
    success: true,
    reviews: allReviews,
  };
};

export const approveReview = async (id: string) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  await db
    .update(projectReviews)
    .set({
      approved: true,
      updatedAt: new Date(),
    })
    .where(eq(projectReviews.id, id));

  revalidatePath("/portfolio");
  revalidatePath("/admin/projects/reviews");

  return {
    success: true,
    message: "Review approved successfully",
  };
};

export const deleteReview = async (id: string) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  await db.delete(projectReviews).where(eq(projectReviews.id, id));

  revalidatePath("/portfolio");
  revalidatePath("/admin/projects/reviews");

  return {
    success: true,
    message: "Review deleted successfully",
  };
};
