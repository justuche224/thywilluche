"use client";

import Image from "next/image";
import {Oswald} from "next/font/google";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
});

const merch = {
    title: "Author Logo T-Shirt",
    category: "Apparel",
    images: [
        "/images/IMG_20250907_010336[1].jpg",
        "/images/IMG_20250907_010336[1].jpg",
        "/images/IMG_20250907_010336[1].jpg",
        "/images/IMG_20250907_010336[1].jpg",
    ],
    price: "$29.99",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
        {name: "Black", hex: "#000000"},
        {name: "White", hex: "#FFFFFF"},
        {name: "Navy", hex: "#001f3f"},
    ],
    material: "100% Cotton",
    stockStatus: "In Stock",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tags: ["apparel", "t-shirt", "casual"],
    badge: "New"
}


export const MerchPage = ({merchSlug}: { merchSlug: string }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % merch.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + merch.images.length) % merch.images.length);
    };

    return (
        <div className={"w-full min-h-screen py-8 md:py-12"}>
            <div className={"container mx-auto max-w-6xl px-4 md:px-6"}>
                <div className={"grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12"}>
                    {/* Left Column - Image Gallery */}
                    <div className={"md:col-span-2 flex flex-col"}>
                        <div className={"w-full max-w-sm mx-auto md:mx-0 relative"}>
                            {/* Main Image */}
                            <div className={"relative"}>
                                <Image
                                    src={merch.images[currentImageIndex]}
                                    alt={`${merchSlug} - Image ${currentImageIndex + 1}`}
                                    width={500}
                                    height={500}
                                    className={"w-full h-auto object-cover aspect-square rounded-lg shadow-2xl"}
                                />

                                {/* Badge */}
                                {merch.badge && (
                                    <div
                                        className={"absolute -top-2 -right-2 bg-green-600 text-white px-6 py-2 font-bold text-sm uppercase shadow-lg transform rotate-12 origin-center z-10"}>
                                        {merch.badge}
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {merch.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className={"absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"}
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className={"w-6 h-6"}/>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className={"absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"}
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className={"w-6 h-6"}/>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {merch.images.length > 1 && (
                                <div className={"flex gap-2 mt-4 overflow-x-auto"}>
                                    {merch.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                                                currentImageIndex === index
                                                    ? "border-primary ring-2 ring-primary"
                                                    : "border-border hover:border-primary/50"
                                            }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${merchSlug} thumbnail ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className={"w-full h-full object-cover"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Merch Details */}
                    <div className={"md:col-span-3 flex flex-col gap-3"}>
                        {/* Title */}
                        <h1 className={`${oswald.className} font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight`}>
                            {merch.title}
                        </h1>

                        {/* Price */}
                        <div className={"text-2xl md:text-3xl font-bold text-primary"}>
                            {merch.price}
                        </div>

                        {/* Merch Info */}
                        <div className={"flex flex-col gap-3 text-sm md:text-base"}>
                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Category:</span>
                                <span className={"text-foreground"}>{merch.category}</span>
                            </div>

                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Material:</span>
                                <span className={"text-foreground"}>{merch.material}</span>
                            </div>

                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Stock Status:</span>
                                <span className={`font-semibold ${merch.stockStatus === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                                    {merch.stockStatus}
                                </span>
                            </div>

                            {/* Size Selection */}
                            <div className={"flex flex-col gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Size:</span>
                                <div className={"flex flex-wrap gap-2"}>
                                    {merch.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-md transition-all font-semibold ${
                                                selectedSize === size
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background border-border hover:border-primary"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className={"flex flex-col gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Color:</span>
                                <div className={"flex flex-wrap gap-3"}>
                                    {merch.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`flex items-center gap-2 px-3 py-2 border rounded-md transition-all ${
                                                selectedColor === color.name
                                                    ? "border-primary ring-2 ring-primary"
                                                    : "border-border hover:border-primary/50"
                                            }`}
                                        >
                                            <div
                                                className={"w-6 h-6 rounded-full border border-border"}
                                                style={{backgroundColor: color.hex}}
                                            />
                                            <span className={"text-sm font-medium"}>{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className={"mt-4"}>
                            <Button size="lg" className={"text-base font-semibold px-8 w-full md:w-auto"}>
                                Add to Cart
                            </Button>
                        </div>

                        {/* Description */}
                        <div className={"mt-4"}>
                            <h2 className={`${oswald.className} text-xl md:text-2xl font-semibold mb-4`}>
                                Description
                            </h2>
                            <p className={"text-foreground/90 leading-relaxed text-sm md:text-base text-justify"}>
                                {merch.description}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className={"mt-4 flex flex-wrap gap-2"}>
                            {merch.tags.map((tag, index) => (
                                <Link 
                                    key={index} 
                                    href={`/shop/merch/tags/${tag}`} 
                                    className={"px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 transition-all capitalize"}
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
