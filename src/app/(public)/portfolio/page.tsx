import React from "react";
import PortfolioPage from "@/components/portfolio";
import { getPublicProjects } from "@/actions/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore the creative portfolio of Thywill Uche. Discover inspiring projects, writings, and creative works that showcase transformation, resilience, and authentic storytelling.",
  keywords: [
    "portfolio",
    "projects",
    "creative works",
    "Thywill Uche portfolio",
    "author portfolio",
    "writing portfolio",
    "creative projects",
    "artistic works",
  ],
  openGraph: {
    title: "Portfolio | Thywill Uche",
    description:
      "Explore the creative portfolio of Thywill Uche. Discover inspiring projects, writings, and creative works.",
    url: "https://thywilluche.com/portfolio",
    siteName: "Thywill Uche",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://thywilluche.com/images/main.jpg",
        width: 1200,
        height: 630,
        alt: "Thywill Uche Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Thywill Uche",
    description:
      "Explore the creative portfolio of Thywill Uche. Discover inspiring projects and creative works.",
    images: ["https://thywilluche.com/images/main.jpg"],
  },
  alternates: {
    canonical: "https://thywilluche.com/portfolio",
  },
};

const page = async () => {
  const projects = await getPublicProjects();

  return <PortfolioPage projects={projects} />;
};

export default page;
