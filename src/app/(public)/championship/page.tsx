import Championship from "@/components/championship";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Champion's League | Thywill Uche",
  description: "Thywill's Book Review Champion's League",
  openGraph: {
    title: "Champion's League | Thywill Uche",
    description: "Thywill's Book Review Champion's League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Champion's League | Thywill Uche",
    description: "Thywill's Book Review Champion's League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
};

const page = () => {
  return (
    <div>
      <Championship />
    </div>
  );
};

export default page;
