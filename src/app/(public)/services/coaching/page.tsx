import React from "react";
import CoachingPage from "@/components/services/coaching";
import { getServiceSection } from "@/actions/services-content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServiceSection("coaching");
  const title = content.title || "Coaching Services | Thywill Uche";
  const description =
    content.description ||
    "One-on-one personalized coaching sessions designed to help you navigate life's challenges, build resilience, and achieve your personal goals. Together, we'll create a roadmap for your mental wellness and personal growth.";

  return {
    title,
    description,
    keywords: [
      "life coaching",
      "personal coaching",
      "mental wellness",
      "resilience coaching",
      "personal development",
      "goal setting",
      "Thywill Uche coaching",
      "one-on-one coaching",
      "wellness strategies",
    ],
    openGraph: {
      title,
      description,
      url: "https://thywilluche.com/services/coaching",
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://thywilluche.com/images/main.jpg",
          width: 1200,
          height: 630,
          alt: "Coaching Services",
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
      canonical: "https://thywilluche.com/services/coaching",
    },
  };
}

const page = async () => {
  const content = await getServiceSection("coaching");
  return <CoachingPage content={content} />;
};

export default page;
