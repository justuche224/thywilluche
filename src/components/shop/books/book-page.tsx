import Image from "next/image";
import {Oswald, Pacifico} from "next/font/google";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const pacifico = Pacifico({
    variable: "--font-pacifico",
    subsets: ["latin"],
    weight: "400",
});

const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
});

const book = {
    tittle: "Days I Do Not Die",
    series: "First Step",
    tropes: [
        {
            name: "Life",
            slug: "life",
        },
        {
            name: "Forced Proximity",
            slug: "forced-proximity",
        }
    ],
    releaseDate: "2025-09-07",
    synopsis: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    variant: "Hardcover",
    tags: ["tag1", "tag2", "tag3"],
    badge: "Popular"
}


export const BookPage = ({bookSlug}: { bookSlug: string }) => {
    return (
        <div className={"w-full min-h-screen py-8 md:py-12"}>
            <div className={"container mx-auto max-w-6xl px-4 md:px-6"}>
                <div className={"grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12"}>
                    {/* Left Column - Book Cover and Purchase Links */}
                    <div className={"md:col-span-2 flex flex-col"}>
                        <div className={"w-full max-w-sm mx-auto md:mx-0 relative"}>
                            <Image
                                src={"/images/IMG_20250907_010336[1].jpg"}
                                alt={bookSlug}
                                width={500}
                                height={500}
                                className={"w-full h-auto object-cover aspect-[3/4] rounded-lg shadow-2xl"}
                            />

                            {/* Badge */}
                            {book.badge && (
                                <div
                                    className={"absolute -top-2 -right-2 bg-green-600 text-white px-6 py-2 font-bold text-sm uppercase shadow-lg transform rotate-12 origin-center"}>
                                    {book.badge}
                                </div>
                            )}

                            {/* Purchase Section */}
                            <div className={"flex flex-col gap-3 mt-6"}>
                                <p className={`text-lg md:text-xl font-semibold text-center ${pacifico.className}`}>
                                    Available now
                                </p>
                                <Button className={"uppercase w-full h-11 text-sm font-semibold"} variant="default">
                                    Amazon
                                </Button>
                                <Button className={"uppercase w-full h-11 text-sm font-semibold"} variant="default">
                                    Bookshop.org
                                </Button>
                                <Button className={"uppercase w-full h-11 text-sm font-semibold"} variant="default">
                                    Books-a-million
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Book Details */}
                    <div className={"md:col-span-3 flex flex-col gap-3"}>
                        {/* Title */}
                        <h1 className={`${oswald.className} font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight`}>
                            {book.tittle}
                        </h1>

                        {/* Book Info */}
                        <div className={"flex flex-col gap-3 text-sm md:text-base"}>
                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Series:</span>
                                <span className={"text-foreground"}>{book.series}</span>
                            </div>

                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Tropes:</span>
                                <span className={"flex flex-wrap gap-2"}>
                                    {book.tropes.map((trope, index) => (
                                        <span key={index}>
                                            <Link
                                                href={`/shop/books/tropes/${trope.slug}`}
                                                className={"text-primary hover:underline underline-offset-4 transition-all"}
                                            >
                                                {trope.name}
                                            </Link>
                                            {index < book.tropes.length - 1 &&
                                                <span className={"text-foreground/60"}>, </span>}
                                        </span>
                                    ))}
                                </span>
                            </div>

                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Release Date:</span>
                                <span className={"text-foreground"}>{book.releaseDate}</span>
                            </div>

                            {/*Book Variant    */}
                            <div className={"flex flex-wrap items-baseline gap-2"}>
                                <span className={"font-bold text-foreground/80"}>Variant:</span>
                                <span className={"text-foreground"}>{book.variant}</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className={"mt-2"}>
                            <Button size="lg" className={"text-base font-semibold px-8"}>
                                Buy Now
                            </Button>
                        </div>

                        {/* Synopsis */}
                        <div className={"mt-4"}>
                            <h2 className={`${oswald.className} text-xl md:text-2xl font-semibold mb-4`}>
                                Synopsis
                            </h2>
                            <p className={"text-foreground/90 leading-relaxed text-sm md:text-base text-justify"}>
                                {book.synopsis}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className={"mt-4 flex flex-wrap gap-2"}>
                            {book.tags.map((tag, index) => (
                                <Link key={index} href={`/shop/books/tags/${tag}`} className={"capitalize"}>{tag}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}