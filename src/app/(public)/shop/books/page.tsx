import React from "react";
import BooksPage from "@/components/shop/books";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Browse our collection of inspirational and motivational books by Thywill Uche. Transform your life with powerful stories, insights, and wisdom.",
  keywords: [
    "books",
    "Thywill Uche books",
    "inspirational books",
    "motivational books",
    "self-help books",
    "personal development",
    "Days I Do Not Die",
    "author books",
  ],
  openGraph: {
    title: "Books | Thywill Uche",
    description:
      "Browse our collection of inspirational and motivational books by Thywill Uche. Transform your life with powerful stories, insights, and wisdom.",
    url: "https://thywilluche.com/shop/books",
    siteName: "Thywill Uche",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://thywilluche.com/images/main.jpg",
        width: 1200,
        height: 630,
        alt: "Thywill Uche Books",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Books | Thywill Uche",
    description:
      "Browse our collection of inspirational and motivational books by Thywill Uche.",
    images: ["https://thywilluche.com/images/main.jpg"],
  },
  alternates: {
    canonical: "https://thywilluche.com/shop/books",
  },
};

const page = () => {
  return <BooksPage />;
};

export default page;
