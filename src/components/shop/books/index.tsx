"use client";

import Image from "next/image";
import Link from "next/link";
import { Pacifico, Oswald } from "next/font/google";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  getPublicBooksWithVariants,
  getPublicFeaturedBooks,
} from "@/actions/shop/books/public";
import { FeaturedCarousel } from "./featured-carousel";
import AddToCart from "@/components/cart-button";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const BookSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-20 w-full max-w-4xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-full p-4 flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  </div>
);

const BooksPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-books"],
    queryFn: () => getPublicBooksWithVariants(1, 10),
  });

  const { data: featuredData } = useQuery({
    queryKey: ["public-featured-books"],
    queryFn: () => getPublicFeaturedBooks(),
  });

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      {featuredData?.books && featuredData.books.length > 0 && (
        <div id="featured-books" className="space-y-6">
          <FeaturedCarousel books={featuredData.books} />
        </div>
      )}
      <div className="container mx-auto max-w-7xl px-2 md:px-5 lg:px-10 bg-white py-10 rounded-lg">
        <h1
          className={`text-3xl lg:text-4xl xl:text-5xl ${pacifico.className} font-bold text-gray-900 mb-2`}
        >
          Books
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Discover our collection of inspiring books
        </p>

        {isLoading ? (
          <div className="space-y-10">
            <BookSkeleton />
            <Separator />
            <BookSkeleton />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              Error loading books. Please try again.
            </p>
          </div>
        ) : !data?.books || data.books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No books available at the moment
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {data.books.map((book, index) => (
              <div key={book.id} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2
                      className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
                    >
                      {book.tittle}
                    </h2>
                    {book.badge && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                        {book.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl line-clamp-3">
                    {book.synopsis}
                  </p>
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {book.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {book.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="w-full p-4 flex flex-col gap-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Link
                        href={`/shop/books/${book.slug}?variant=${variant.id}`}
                        className="aspect-[3/4] w-full overflow-hidden rounded-md relative"
                      >
                        <Image
                          fill
                          alt={`${book.tittle} - ${variant.variant}`}
                          src={variant.imageUrl}
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-lg font-semibold ${oswald.className}`}
                          >
                            {variant.variant}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              variant.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : variant.status === "Sold Out"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {variant.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-primary">
                              ${variant.price}
                            </p>
                          </div>
                        </div>
                      </div>
                      <AddToCart
                        book={{
                          id: book.id,
                          tittle: book.tittle,
                          slug: book.slug,
                        }}
                        variant={{
                          id: variant.id,
                          variant: variant.variant,
                          price: variant.price,
                          imageUrl: variant.imageUrl,
                          status: variant.status,
                        }}
                      />
                    </div>
                  ))}
                </div>
                {index < data.books.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
