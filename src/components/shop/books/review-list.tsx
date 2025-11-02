"use client";

import React from "react";
import { Oswald } from "next/font/google";
import { Star, User } from "lucide-react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface BookReview {
  id: string;
  reviewerName: string;
  rating: number;
  content: string;
  createdAt: Date;
}

interface ReviewListProps {
  reviews: BookReview[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <p className={`text-lg text-gray-600 ${oswald.className}`}>
          No reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-lg border border-gray-100 p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className={`font-semibold ${oswald.className}`}>
                  {review.reviewerName}
                </h4>
                <p className={`text-sm text-gray-600 ${oswald.className}`}>
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.round(review.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <p
            className={`text-gray-700 ${oswald.className} leading-relaxed whitespace-pre-wrap`}
          >
            {review.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
