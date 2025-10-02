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

const BooksList = [
  {
    title: "Days I Do Not Die",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex blanditiis voluptatem vero tempore cum veritatis repellat sequi et beatae ut fugiat veniam, voluptas ipsa qui sit natus debitis, minima placeat.",
    variants: [
      {
        title: "Hardcover",
        price: 100,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
      {
        title: "Softcover",
        price: 50,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
      {
        title: "E-Book",
        price: 20,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
    ],
  },
  {
    title: "The Art of War",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex blanditiis voluptatem vero tempore cum veritatis repellat sequi et beatae ut fugiat veniam, voluptas ipsa qui sit natus debitis, minima placeat.",
    variants: [
      {
        title: "Hardcover",
        price: 100,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
      {
        title: "Softcover",
        price: 50,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
      {
        title: "E-Book",
        price: 20,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
    ],
  },
  {
    title: "The Art of War",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex blanditiis voluptatem vero tempore cum veritatis repellat sequi et beatae ut fugiat veniam, voluptas ipsa qui sit natus debitis, minima placeat.",
    variants: [
      {
        title: "Hardcover",
        price: 100,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
      {
        title: "Softcover",
        price: 50,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
      {
        title: "E-Book",
        price: 20,
        stock: 10,
        image: "/images/IMG_20250907_010336[1].jpg",
      },
    ],
  },
];

const BooksPage = () => {
  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div id="new-release-banner" className="space-y-6">
        <div className="w-full max-w-4xl py-8 px-6 bg-white mx-auto rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <h2
              className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
            >
              Days I Do Not Die
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex
              blanditiis voluptatem vero tempore cum veritatis repellat sequi et
              beatae ut fugiat veniam, voluptas ipsa qui sit natus debitis,
              minima placeat.
            </p>
            <Button className="w-fit gap-2 flex items-center justify-center text-sm md:text-base">
              <ShoppingCart size={16} />
              Buy Now
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
            <div className="aspect-[3/4] w-48 md:w-56 lg:w-64 overflow-hidden rounded-md shadow-sm">
              <Image
                height={400}
                width={300}
                alt="new release banner"
                className="w-full h-full object-cover"
                src="/images/IMG_20250907_010336[1].jpg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-2 md:px-5 lg:px-10 bg-white py-10">
        <h1
          className={`text-3xl lg:text-4xl xl:text-5xl ${pacifico.className} font-bold text-gray-900 mb-2`}
        >
          Books
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Discover our collection of inspiring books
        </p>
        <div className="space-y-10">
          {BooksList.map((book, index) => (
            <div key={index} className="space-y-6">
              <div className="space-y-2">
                <h2
                  className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
                >
                  {book.title}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                  {book.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {book.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="w-full p-4 flex flex-col gap-3"
                  >
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

export default BooksPage;
