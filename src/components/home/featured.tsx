import Image from "next/image";
import React from "react";
import { Oswald } from "next/font/google";
import { Button } from "../ui/button";
import Link from "next/link";
import { Star, User } from "lucide-react";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface BookReview {
  id: string;
  reviewerName: string;
  work?: string | null;
  rating: number;
  content: string;
  createdAt: Date;
}

interface FeaturedProps {
  title?: string;
  quote?: string;
  description?: string;
  image1?: string;
  image2?: string;
  reviews?: BookReview[];
}

const Featured = ({
  title = "Latest Addition",
  quote = "SOME BATTLES ARE INVISIBLE. SOME SCARS ARE BURIED DEEP. BUT SURVIVAL ITSELF IS THE LOUDEST TESTIMONY.",
  description = "In Days I Do Not Die, Thywill Uche opens the door to his most vulnerable truths-sharing a raw, unfiltered journey through struggle, survival, and the silent weight of mental illness. This is not just a story of pain; it is a story of recovery, rebirth, and the relentless will to live when life itself feels unbearable.",
  image1 = "/images/IMG_20250918_104735[2].jpg",
  image2 = "/images/IMG_20250716_093443[1].jpg",
  reviews = [],
}: FeaturedProps) => {
  return (
    <div className="w-full mt-24 bg-white/50 overflow-clip">
      <div className="container mx-auto px-2 lg:px-8 py-16 lg:py-20">
        <h2 className={`text-5xl ${georgiaItalic.className} text-center mb-10`}>
          {title}
        </h2>
        <div className=" max-w-2xl 2xl:max-w-4xl w-full mx-auto grid grid-cols-2 gap-0  relative">
          <Image
            src="/doodles/doodle-5.svg"
            alt="doodle"
            className="absolute -top-10 md:-top-20 -left-10 md:-left-50 -z-[1] "
            width={300}
            height={300}
          />
          {/* flip left to righ */}
          <Image
            src="/doodles/doodle-5.svg"
            alt="doodle"
            className="absolute -bottom-10 md:-bottom-20 -right-10 md:-right-50 -z-[1] rotate-180"
            width={300}
            height={300}
          />
          <div className="space-y-2">
            <div className="p-2">
              <p
                className={`text-md md:text-2xl font-semibold ${oswald.className}`}
              >
                {quote}
              </p>
            </div>
            <div className="p-1 rounded-lg">
              <Image
                src={image1}
                width={200}
                height={500}
                alt="Featured image 1"
                className="w-full aspect-[3/4] rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-1 rounded-lg">
              <Image
                src={image2}
                width={200}
                height={500}
                alt="Featured image 2"
                className="w-full aspect-[3/4] rounded-lg"
              />
            </div>
            <div className="p-2">
              <p
                className={`text-sm md:text-xl xl:text-2xl font-semibold text-justify ${oswald.className}`}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <Button asChild>
            <Link href="/shop/books">Buy Now</Link>
          </Button>
        </div>

        {reviews.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h3
              className={`text-3xl ${georgiaItalic.className} text-center mb-8`}
            >
              What Readers Are Saying
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg border border-gray-100 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-sm ${oswald.className}`}
                        >
                          {review.reviewerName}
                        </h4>
                        {review.work && (
                          <p
                            className={`text-xs text-muted-foreground ${oswald.className}`}
                          >
                            {review.work}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < Math.round(review.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    className={`text-sm text-gray-700 ${oswald.className} leading-relaxed line-clamp-4`}
                  >
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Featured;
