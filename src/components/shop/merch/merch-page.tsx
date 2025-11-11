"use client";

import Image from "next/image";
import { Oswald } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMerchBySlug } from "@/actions/shop/merch/public";
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
import AddMerchToCart from "@/components/merch-cart-button";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const MerchPage = ({ merchSlug }: { merchSlug: string }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["merch", merchSlug],
    queryFn: () => getMerchBySlug(merchSlug),
  });

  useEffect(() => {
    if (data?.merch) {
      const variantParam = searchParams.get("variant");
      if (variantParam) {
        const variantExists = data.merch.variants.some(
          (variant) => variant.id === variantParam
        );
        if (variantExists) {
          setSelectedVariantId(variantParam);
        }
      }
    }
  }, [data?.merch, searchParams]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen py-8 md:py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-2 flex flex-col">
              <Skeleton className="w-full max-w-sm mx-auto md:mx-0 aspect-square rounded-lg" />
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

  if (error || !data?.merch) {
    return (
      <div className="w-full min-h-screen py-8 md:py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Merchandise Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {data?.message ||
                "The merchandise you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link href="/shop/merch">Back to Merchandise</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { merch } = data;
  const currentVariant = selectedVariantId
    ? merch.variants.find((v) => v.id === selectedVariantId)
    : merch.variants[0];

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
          <div className={"md:col-span-2 flex flex-col"}>
            <div className={"w-full max-w-sm mx-auto md:mx-0 relative"}>
              <Image
                src={currentVariant.imageUrl}
                alt={merch.name}
                width={500}
                height={500}
                className={
                  "w-full h-auto object-cover aspect-square rounded-lg shadow-2xl"
                }
              />

              {merch.badge && (
                <div
                  className={
                    "absolute -top-2 -right-2 bg-green-600 text-white px-6 py-2 font-bold text-sm uppercase shadow-lg transform rotate-12 origin-center z-10"
                  }
                >
                  {merch.badge}
                </div>
              )}

              <div className={"flex flex-col gap-3 mt-6"}>
                <p
                  className={`text-lg md:text-xl font-semibold text-center ${georgiaItalic.className}`}
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
              {merch.name}
            </h1>

            <div className={"flex flex-col gap-3 text-sm md:text-base"}>
              {merch.variants.length > 1 ? (
                <div className={"flex flex-wrap items-baseline gap-2"}>
                  <span className={"font-bold text-foreground/80"}>
                    Variant:
                  </span>
                  <Select
                    value={selectedVariantId || merch.variants[0].id}
                    onValueChange={setSelectedVariantId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {merch.variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.variant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className={"flex flex-wrap items-baseline gap-2"}>
                  <span className={"font-bold text-foreground/80"}>
                    Variant:
                  </span>
                  <span className={"text-foreground"}>
                    {currentVariant.variant}
                  </span>
                </div>
              )}

              <div className={"flex flex-wrap items-baseline gap-2"}>
                <span className={"font-bold text-foreground/80"}>Price:</span>
                <span className={"text-foreground font-semibold"}>
                  ${Number(currentVariant.price)}
                </span>
                {currentVariant.slashedFrom && (
                  <span
                    className={"text-muted-foreground line-through text-sm"}
                  >
                    ${Number(currentVariant.slashedFrom)}
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
                <AddMerchToCart
                  merch={{
                    id: merch.id,
                    name: merch.name,
                    slug: merch.slug,
                  }}
                  variant={{
                    id: currentVariant.id,
                    variant: currentVariant.variant,
                    price: Number(currentVariant.price),
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
                Description
              </h2>
              <div
                className={
                  "text-foreground/90 leading-relaxed text-sm md:text-base text-justify whitespace-pre-wrap"
                }
              >
                {merch.description}
              </div>
            </div>

            {merch.tags && merch.tags.length > 0 && (
              <div className={"mt-4 flex flex-wrap gap-2"}>
                {merch.tags.map((tag, index) => (
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
