import React from "react";
import ProjectDetail from "@/components/portfolio/project-detail";
import { getPublicProjectById } from "@/actions/projects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublicProjectById(id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = project.title;
  const description =
    project.longDescription ||
    project.description ||
    `Discover ${project.title} by Thywill Uche. ${project.description}`;
  const imageUrl = project.thumbnailUrl
    ? project.thumbnailUrl.startsWith("http")
      ? project.thumbnailUrl
      : `https://thywilluche.com${project.thumbnailUrl}`
    : project.mediaUrl.startsWith("http")
    ? project.mediaUrl
    : `https://thywilluche.com${project.mediaUrl}`;
  const url = `https://thywilluche.com/portfolio/${project.id}`;
  const projectDate = project.date
    ? new Date(project.date).toISOString()
    : undefined;

  return {
    title,
    description,
    keywords: [
      project.category,
      project.title,
      "Thywill Uche",
      "portfolio",
      "project",
      "creative work",
      project.mediaType,
    ],
    authors: [{ name: "Thywill Uche", url: "https://thywilluche.com" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(projectDate && { publishedTime: projectDate }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@thywilluche",
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:author": "Thywill Uche",
      "article:published_time": projectDate || "",
      "article:section": project.category,
    },
  };
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const project = await getPublicProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
};

export default page;
