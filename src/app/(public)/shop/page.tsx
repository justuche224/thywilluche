import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, ArrowRight } from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import type { Metadata } from "next";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Discover our collection of inspiring books and exclusive merchandise by Thywill Uche. Support independent creativity and find something special for yourself or as a gift.",
  keywords: [
    "shop",
    "books",
    "merchandise",
    "Thywill Uche shop",
    "author merchandise",
    "inspirational books",
    "exclusive merchandise",
    "Days I Do Not Die",
  ],
  openGraph: {
    title: "Shop | Thywill Uche",
    description:
      "Discover our collection of inspiring books and exclusive merchandise by Thywill Uche. Support independent creativity and find something special.",
    url: "https://thywilluche.com/shop",
    siteName: "Thywill Uche",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://thywilluche.com/images/main.jpg",
        width: 1200,
        height: 630,
        alt: "Thywill Uche Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Thywill Uche",
    description:
      "Discover our collection of inspiring books and exclusive merchandise by Thywill Uche.",
    images: ["https://thywilluche.com/images/main.jpg"],
  },
  alternates: {
    canonical: "https://thywilluche.com/shop",
  },
};

const page = () => {
  return (
    <div className="container mx-auto px-4 py-10 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h1
          className={`text-4xl lg:text-5xl xl:text-6xl ${georgiaItalic.className} font-bold text-gray-900`}
        >
          Shop ThyWillUche
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Discover our collection of inspiring books and exclusive merchandise.
          Support creativity and find something special for yourself or as a
          gift.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Books Section */}
        <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-[16/10] relative overflow-hidden">
            <Image
              src="/images/IMG_20250907_010336[1].jpg"
              alt="Books collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="p-8 space-y-4">
            <h2
              className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
            >
              Books
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Explore our collection of thought-provoking books that inspire,
              educate, and challenge perspectives. From hardcover editions to
              digital formats, find your next great read.
            </p>
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Featured:</span>{" "}
                Days I Do Not Die
              </div>
              <Link href="/shop/books">
                <Button className="gap-2">
                  Browse Books
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Merchandise Section */}
        <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-[16/10] relative overflow-hidden">
            <Image
              src="/images/IMG_20240828_162619[1].jpg"
              alt="Merchandise collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="p-8 space-y-4">
            <h2
              className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
            >
              Merchandise
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Show your support with our exclusive collection of apparel,
              accessories, and lifestyle items. Each piece features unique
              designs inspired by our creative works.
            </p>
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Featured:</span>{" "}
                Official T-Shirt Collection
              </div>
              <Link href="/shop/merch">
                <Button className="gap-2">
                  Shop Merch
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h3
          className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
        >
          Support Independent Creativity
        </h3>
        <p className="text-muted-foreground">
          Every purchase helps support ongoing creative projects and brings new
          ideas to life. Thank you for being part of the journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop/books">
            <Button size="lg" className="gap-2">
              <BookOpen size={20} />
              Explore Books
            </Button>
          </Link>
          <Link href="/shop/merch">
            <Button size="lg" variant="outline" className="gap-2">
              <ShoppingBag size={20} />
              Browse Merchandise
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
