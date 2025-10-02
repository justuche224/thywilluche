"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Pacifico, Oswald } from "next/font/google";
import { Separator } from "@/components/ui/separator";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const MerchList = [
  {
    title: "Official T-Shirt",
    description:
      "Comfortable cotton t-shirt featuring the ThyWillUche brand. Perfect for everyday wear and showing your support.",
    variants: [
      {
        title: "Small",
        price: 25,
        stock: 15,
        image: "/images/IMG_20240828_162619[1].jpg",
      },
      {
        title: "Medium",
        price: 25,
        stock: 20,
        image: "/images/IMG_20240828_162619[1].jpg",
      },
      {
        title: "Large",
        price: 25,
        stock: 12,
        image: "/images/IMG_20240828_162619[1].jpg",
      },
      {
        title: "XL",
        price: 25,
        stock: 8,
        image: "/images/IMG_20240828_162619[1].jpg",
      },
    ],
  },
  {
    title: "Hoodie Collection",
    description:
      "Stay warm and stylish with our premium hoodie featuring unique designs inspired by our latest works.",
    variants: [
      {
        title: "Small",
        price: 55,
        stock: 10,
        image: "/images/IMG_20240828_162759[1].jpg",
      },
      {
        title: "Medium",
        price: 55,
        stock: 14,
        image: "/images/IMG_20240828_162759[1].jpg",
      },
      {
        title: "Large",
        price: 55,
        stock: 9,
        image: "/images/IMG_20240828_162759[1].jpg",
      },
      {
        title: "XL",
        price: 55,
        stock: 6,
        image: "/images/IMG_20240828_162759[1].jpg",
      },
    ],
  },
  {
    title: "Coffee Mug",
    description:
      "Start your day with inspiration. Our ceramic mug features motivational quotes and artwork from our collection.",
    variants: [
      {
        title: "11oz Standard",
        price: 15,
        stock: 25,
        image: "/images/IMG_20250716_093443[1].jpg",
      },
      {
        title: "15oz Large",
        price: 18,
        stock: 18,
        image: "/images/IMG_20250716_093443[1].jpg",
      },
    ],
  },
];

const MerchPage = () => {
  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div id="featured-banner" className="space-y-6">
        <div className="w-full max-w-4xl py-8 px-6 bg-white mx-auto rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <h2
              className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
            >
              Official Merchandise
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Show your support and style with our exclusive collection of
              apparel and accessories. Each piece is crafted with care and
              features unique designs from our creative works.
            </p>
            <Button className="w-fit gap-2 flex items-center justify-center text-sm md:text-base">
              <ShoppingCart size={16} />
              Shop Collection
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
            <div className="aspect-[3/4] w-48 md:w-56 lg:w-64 overflow-hidden rounded-md shadow-sm">
              <Image
                height={400}
                width={300}
                alt="featured merchandise"
                className="w-full h-full object-cover"
                src="/images/IMG_20240828_162619[1].jpg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-2 md:px-5 lg:px-10 bg-white py-10">
        <h1
          className={`text-3xl lg:text-4xl xl:text-5xl ${pacifico.className} font-bold text-gray-900 mb-2`}
        >
          Merchandise
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Discover our collection of apparel and accessories
        </p>
        <div className="space-y-10">
          {MerchList.map((item, index) => (
            <div key={index} className="space-y-6">
              <div className="space-y-2">
                <h2
                  className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
                >
                  {item.title}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                  {item.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {item.variants.map((variant, index) => (
                  <div key={index} className="w-full p-4 flex flex-col gap-3">
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-md">
                      <Image
                        height={300}
                        width={225}
                        alt={variant.title}
                        src={variant.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3
                        className={`text-lg font-semibold ${oswald.className}`}
                      >
                        {variant.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-primary">
                          ${variant.price}
                        </p>
                        <p
                          className={`text-sm text-muted-foreground ${
                            variant.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {variant.stock > 0
                            ? `${variant.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full gap-2 flex items-center justify-center text-sm md:text-base mt-auto">
                      <ShoppingCart size={16} /> Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchPage;
