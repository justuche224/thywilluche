import React from "react";
import GhostwritingPage from "@/components/services/ghostwriting";
import { getServiceSection } from "@/actions/services-content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServiceSection("ghostwriting");
  const title = content.title || "Ghostwriting Services | Thywill Uche";
  const description =
    content.description ||
    "Bring your story to life with professional ghostwriting services. Whether it's a memoir, self-help book, or personal project, I'll help you craft compelling narratives that resonate with your audience.";

  return {
    title,
    description,
    keywords: [
      "ghostwriting",
      "book writing",
      "memoir writing",
      "self-help books",
      "professional writing",
      "book ghostwriter",
      "Thywill Uche ghostwriting",
      "manuscript development",
      "book editing",
      "content writing",
    ],
    openGraph: {
      title,
      description,
      url: "https://thywilluche.com/services/ghostwriting",
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://thywilluche.com/images/main.jpg",
          width: 1200,
          height: 630,
          alt: "Ghostwriting Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://thywilluche.com/images/main.jpg"],
    },
    alternates: {
      canonical: "https://thywilluche.com/services/ghostwriting",
    },
  };
}

const page = async () => {
  const content = await getServiceSection("ghostwriting");
  return <GhostwritingPage content={content} />;
};

export default page;
