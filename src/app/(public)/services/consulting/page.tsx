import React from "react";
import ConsultingPage from "@/components/services/consulting";
import { getServiceSection } from "@/actions/services-content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServiceSection("consulting");
  const title = content.title || "Consulting Services | Thywill Uche";
  const description =
    content.description ||
    "Strategic consulting for organizations, content creators, and individuals looking to build authentic mental health initiatives, develop impactful content, or create meaningful community engagement strategies.";

  return {
    title,
    description,
    keywords: [
      "consulting",
      "strategic consulting",
      "mental health advocacy",
      "content strategy",
      "brand development",
      "community engagement",
      "Thywill Uche consulting",
      "organizational consulting",
      "content consulting",
    ],
    openGraph: {
      title,
      description,
      url: "https://thywilluche.com/services/consulting",
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://thywilluche.com/images/main.jpg",
          width: 1200,
          height: 630,
          alt: "Consulting Services",
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
      canonical: "https://thywilluche.com/services/consulting",
    },
  };
}

const page = async () => {
  const content = await getServiceSection("consulting");
  return <ConsultingPage content={content} />;
};

export default page;
