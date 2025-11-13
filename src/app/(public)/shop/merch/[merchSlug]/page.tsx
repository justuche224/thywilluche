import { MerchPage } from "@/components/shop/merch/merch-page";
import { getMerchBySlug } from "@/actions/shop/merch/public";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ merchSlug: string }>;
}): Promise<Metadata> {
  const { merchSlug } = await params;
  const merchData = await getMerchBySlug(merchSlug);

  if (!merchData.merch || merchData.error) {
    return {
      title: "Merchandise Not Found",
    };
  }

  const merch = merchData.merch;
  const firstVariant = merch.variants?.[0];
  const imageUrl = firstVariant?.imageUrl
    ? firstVariant.imageUrl.startsWith("http")
      ? firstVariant.imageUrl
      : `https://thywilluche.com${firstVariant.imageUrl}`
    : "https://thywilluche.com/images/main.jpg";

  const title = merch.name;
  const description =
    merch.description ||
    `Discover ${merch.name} by Thywill Uche. Exclusive merchandise featuring unique designs inspired by our creative works.`;
  const url = `https://thywilluche.com/shop/merch/${merch.slug}`;

  return {
    title,
    description,
    keywords: [
      ...(merch.tags || []),
      merch.name,
      "Thywill Uche",
      "merchandise",
      "apparel",
      "accessories",
      "official merchandise",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
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
      "product:brand": "Thywill Uche",
      ...(merch.tags && merch.tags.length > 0
        ? {
            "product:tag": merch.tags.join(", "),
          }
        : {}),
    },
  };
}

const page = async ({ params }: { params: Promise<{ merchSlug: string }> }) => {
  const { merchSlug } = await params;
  const merchData = await getMerchBySlug(merchSlug);

  if (!merchData.merch || merchData.error) {
    notFound();
  }

  return (
    <div>
      <MerchPage merchSlug={merchSlug} />
    </div>
  );
};

export default page;
