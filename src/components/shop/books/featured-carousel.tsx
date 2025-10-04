"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface FeaturedBook {
  id: string;
  tittle: string;
  slug: string;
  synopsis: string;
  badge?: string | null;
  variants: Array<{
    id: string;
    variant: string;
    imageUrl: string;
    price: number;
    status: string;
  }>;
}

interface FeaturedCarouselProps {
  books: FeaturedBook[];
}

export function FeaturedCarousel({ books }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying || books.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === books.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, books.length]);

  if (books.length === 0) {
    return null;
  }

  const currentBook = books[currentIndex];
  const primaryVariant = currentBook.variants[0];

  return (
    <div
      className="relative w-full max-w-4xl py-8 px-6 bg-white mx-auto rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {currentBook.badge && (
            <span className="inline-block w-fit px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              {currentBook.badge}
            </span>
          )}
          <h2
            className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
          >
            {currentBook.tittle}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4">
            {currentBook.synopsis}
          </p>
          <div className="flex items-center gap-4">
            {primaryVariant && (
              <>
                <p className="text-2xl font-bold text-primary">
                  ${primaryVariant.price}
                </p>
                <Link href={`/shop/books/${currentBook.slug}`}>
                  <Button className="gap-2 flex items-center justify-center text-sm md:text-base">
                    <ShoppingCart size={16} />
                    View Details
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end relative">
          <div className="aspect-[3/4] w-48 md:w-56 lg:w-64 overflow-hidden rounded-md shadow-sm">
            {primaryVariant && (
              <Image
                height={400}
                width={300}
                alt={currentBook.tittle}
                className="w-full h-full object-cover"
                src={primaryVariant.imageUrl}
              />
            )}
          </div>
        </div>
      </div>

      {books.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Previous book"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Next book"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to book ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
