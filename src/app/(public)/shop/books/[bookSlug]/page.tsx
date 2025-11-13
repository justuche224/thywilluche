import { BookPage } from "@/components/shop/books/book-page";
import { getPublicBookBySlug } from "@/actions/shop/books/public";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}): Promise<Metadata> {
  const { bookSlug } = await params;
  const bookData = await getPublicBookBySlug(bookSlug);

  if (!bookData.book || bookData.error) {
    return {
      title: "Book Not Found",
    };
  }

  const book = bookData.book;
  const firstVariant = bookData.variants?.[0];
  const imageUrl = firstVariant?.imageUrl
    ? firstVariant.imageUrl.startsWith("http")
      ? firstVariant.imageUrl
      : `https://thywilluche.com${firstVariant.imageUrl}`
    : "https://thywilluche.com/images/main.jpg";

  const title = book.tittle;
  const description =
    book.synopsis ||
    `Discover ${book.tittle} by Thywill Uche. An inspiring book that will transform your life.`;
  const url = `https://thywilluche.com/shop/books/${book.slug}`;
  const releaseDate = book.releaseDate
    ? new Date(book.releaseDate).toISOString()
    : undefined;

  return {
    title,
    description,
    keywords: [
      ...(book.tags || []),
      book.tittle,
      "Thywill Uche",
      "book",
      "books",
      "inspirational",
      "motivational",
      "self-help",
      "personal development",
      `Buy ${book.tittle} by Thywill Uche`,
    ],
    authors: [{ name: "Thywill Uche", url: "https://thywilluche.com" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "book",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(releaseDate && { publishedTime: releaseDate }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@thywilluche",
    },
    alternates: {
      canonical: url,
    },
    other: {
      "book:author": "Thywill Uche",
      "book:release_date": releaseDate || "",
      ...(book.tags && book.tags.length > 0
        ? {
            "book:tag": book.tags.join(", "),
          }
        : {}),
    },
  };
}

const page = async ({ params }: { params: Promise<{ bookSlug: string }> }) => {
  const { bookSlug } = await params;
  const bookData = await getPublicBookBySlug(bookSlug);

  if (!bookData.book || bookData.error) {
    notFound();
  }

  return (
    <div>
      <BookPage bookSlug={bookSlug} />
    </div>
  );
};

export default page;
