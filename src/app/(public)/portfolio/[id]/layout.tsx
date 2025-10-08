import { Metadata } from "next";
import { getPublicProjectById } from "@/actions/projects";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublicProjectById(params.id);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const title = `${project.title} - By Thywill Uche`;
  const description = project.longDescription || project.description;
  const image = project.thumbnailUrl || project.mediaUrl;
  const url = `https://thywilluche.com/portfolio/${project.id}`;

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
    ],
    authors: [{ name: "Thywill Uche" }],
    creator: "Thywill Uche",
    publisher: "Thywill Uche",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Thywill Uche",
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${project.title} - Thywill Uche`,
        },
      ],
      publishedTime: project.date.toISOString(),
      modifiedTime: project.updatedAt.toISOString(),
      section: project.category,
      tags: [project.category, "portfolio", "creative work"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@thywilluche",
      site: "@thywilluche",
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:author": "Thywill Uche",
      "article:section": project.category,
      "article:tag": project.category,
      "article:published_time": project.date.toISOString(),
      "article:modified_time": project.updatedAt.toISOString(),
    },
  };
}

export default function PortfolioProjectLayout({ children }: Props) {
  return children;
}
