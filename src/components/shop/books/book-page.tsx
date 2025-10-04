"use client";

import Image from "next/image";
import { Oswald, Pacifico } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBookBySlug } from "@/actions/shop/books/public";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const BookPage = ({ bookSlug }: { bookSlug: string }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["book", bookSlug],
    queryFn: () => getBookBySlug(bookSlug),
  });

  useEffect(() => {
    if (data?.book) {
      const variantParam = searchParams.get("variant");
      if (variantParam) {
        const variantExists = data.book.variants.some(
          (variant) => variant.id === variantParam
        );
        if (variantExists) {
          setSelectedVariantId(variantParam);
        }
      }
    }
  }, [data?.book, searchParams]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen py-8 md:py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-2 flex flex-col">
              <Skeleton className="w-full max-w-sm mx-auto md:mx-0 aspect-[3/4] rounded-lg" />
              <div className="flex flex-col gap-3 mt-6">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
            <div className="md:col-span-3 flex flex-col gap-3">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.book) {
    return (
      <div className="w-full min-h-screen py-8 md:py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {data?.message || "The book you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link href="/shop/books">Back to Books</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { book } = data;
  const currentVariant = selectedVariantId
    ? book.variants.find((v) => v.id === selectedVariantId)
    : book.variants[0];

  if (!currentVariant) {
    return null;
  }

  let externalLinks: Array<{ title: string; url: string }> = [];
  if (currentVariant.externalLinks) {
    try {
      externalLinks = JSON.parse(currentVariant.externalLinks);
    } catch {
      externalLinks = [];
    }
  }
  return (
    <div className={"w-full min-h-screen py-8 md:py-12"}>
      <div className={"container mx-auto max-w-6xl px-4 md:px-6"}>
        <div className={"grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12"}>
          {/* Left Column - Book Cover and Purchase Links */}
          <div className={"md:col-span-2 flex flex-col"}>
            <div className={"w-full max-w-sm mx-auto md:mx-0 relative"}>
              <Image
                src={currentVariant.imageUrl}
                alt={book.tittle}
                width={500}
                height={500}
                className={
                  "w-full h-auto object-cover aspect-[3/4] rounded-lg shadow-2xl"
                }
              />

              {book.badge && (
                <div
                  className={
                    "absolute -top-2 -right-2 bg-green-600 text-white px-6 py-2 font-bold text-sm uppercase shadow-lg transform rotate-12 origin-center"
                  }
                >
                  {book.badge}
                </div>
              )}

              <div className={"flex flex-col gap-3 mt-6"}>
                <p
                  className={`text-lg md:text-xl font-semibold text-center ${pacifico.className}`}
                >
                  Available now
                </p>
                {externalLinks.length > 0 ? (
                  externalLinks.map((link, index) => (
                    <Button
                      key={index}
                      asChild
                      className={"uppercase w-full h-11 text-sm font-semibold"}
                      variant="default"
                    >
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.title}
                      </Link>
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm">
                    No purchase links available
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={"md:col-span-3 flex flex-col gap-3"}>
            <h1
              className={`${oswald.className} font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight`}
            >
              {book.tittle}
            </h1>

            <div className={"flex flex-col gap-3 text-sm md:text-base"}>
              {book.seriesId && (
                <div className={"flex flex-wrap items-baseline gap-2"}>
                  <span className={"font-bold text-foreground/80"}>
                    Series:
                  </span>
                  <span className={"text-foreground"}>{book.seriesId}</span>
                </div>
              )}

              {book.tropes && book.tropes.length > 0 && (
                <div className={"flex flex-wrap items-baseline gap-2"}>
                  <span className={"font-bold text-foreground/80"}>
                    Tropes:
                  </span>
                  <span className={"flex flex-wrap gap-2"}>
                    {book.tropes.map((trope, index) => (
                      <span key={trope.id}>
                        <Link
                          href={`/shop/books/tropes/${trope.slug}`}
                          className={
                            "text-primary hover:underline underline-offset-4 transition-all"
                          }
                        >
                          {trope.name}
                        </Link>
                        {index < book.tropes.length - 1 && (
                          <span className={"text-foreground/60"}>, </span>
                        )}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              <div className={"flex flex-wrap items-baseline gap-2"}>
                <span className={"font-bold text-foreground/80"}>
                  Release Date:
                </span>
                <span className={"text-foreground"}>
                  {new Date(book.releaseDate).toLocaleDateString()}
                </span>
              </div>

              <div className={"flex flex-wrap items-baseline gap-2"}>
                <span className={"font-bold text-foreground/80"}>Variant:</span>
                {book.variants.length > 1 ? (
                  <Select
                    value={selectedVariantId || book.variants[0].id}
                    onValueChange={setSelectedVariantId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {book.variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.variant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={"text-foreground"}>
                    {currentVariant.variant}
                  </span>
                )}
              </div>

              <div className={"flex flex-wrap items-baseline gap-2"}>
                <span className={"font-bold text-foreground/80"}>Price:</span>
                <span className={"text-foreground font-semibold"}>
                  ${currentVariant.price}
                </span>
                {currentVariant.slashedFrom && (
                  <span
                    className={"text-muted-foreground line-through text-sm"}
                  >
                    ${currentVariant.slashedFrom}
                  </span>
                )}
              </div>

              <div className={"flex flex-wrap items-baseline gap-2"}>
                <span className={"font-bold text-foreground/80"}>Status:</span>
                <Badge
                  variant={
                    currentVariant.status === "Available"
                      ? "default"
                      : "secondary"
                  }
                >
                  {currentVariant.status}
                </Badge>
              </div>
              <div className="max-w-48">
                <AddToCart
                  book={{
                    id: book.id,
                    tittle: book.tittle,
                    slug: book.slug,
                  }}
                  variant={{
                    id: currentVariant.id,
                    variant: currentVariant.variant,
                    price: currentVariant.price,
                    imageUrl: currentVariant.imageUrl,
                    status: currentVariant.status,
                  }}
                />
              </div>
            </div>

            <div className={"mt-4"}>
              <h2
                className={`${oswald.className} text-xl md:text-2xl font-semibold mb-4`}
              >
                Synopsis
              </h2>
              <p
                className={
                  "text-foreground/90 leading-relaxed text-sm md:text-base text-justify"
                }
              >
                {book.synopsis}
              </p>
            </div>

            {book.tags && book.tags.length > 0 && (
              <div className={"mt-4 flex flex-wrap gap-2"}>
                {book.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
