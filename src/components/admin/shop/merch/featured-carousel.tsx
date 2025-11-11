"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface FeaturedMerch {
  id: string;
  name: string;
  description: string;
  badge?: string | null;
  variants: Array<{
    id: string;
    variant: string;
    imageUrl: string;
    price: string;
    status: string;
  }>;
}

interface FeaturedCarouselProps {
  merch: FeaturedMerch[];
}

export function FeaturedCarousel({ merch }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === merch.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? merch.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying || merch.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === merch.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, merch.length]);

  if (merch.length === 0) {
    return null;
  }

  const currentItem = merch[currentIndex];
  const primaryVariant = currentItem.variants[0];

  return (
    <div
      className="relative w-full max-w-4xl py-8 px-6 bg-white mx-auto rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {currentItem.badge && (
            <span className="inline-block w-fit px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              {currentItem.badge}
            </span>
          )}
          <h2
            className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
          >
            {currentItem.name}
          </h2>
          <div className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">
            {currentItem.description}
          </div>
          <div className="flex items-center gap-4">
            {primaryVariant && (
              <p className="text-2xl font-bold text-primary">
                ${Number(primaryVariant.price)}
              </p>
            )}
            <Button className="gap-2 flex items-center justify-center text-sm md:text-base">
              <ShoppingCart size={16} />
              Buy Now
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end relative">
          <div className="aspect-square w-48 md:w-56 lg:w-64 overflow-hidden rounded-md shadow-sm">
            {primaryVariant && (
              <Image
                height={400}
                width={400}
                alt={currentItem.name}
                className="w-full h-full object-cover"
                src={primaryVariant.imageUrl}
              />
            )}
          </div>
        </div>
      </div>

      {merch.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Next item"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {merch.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
