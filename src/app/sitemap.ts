import { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/actions/blog";
import { getPublicBooksWithVariants } from "@/actions/shop/books/public";
import { getPublicMerchWithVariants } from "@/actions/shop/merch/public";
import { getPublicProjects } from "@/actions/projects";
import db from "@/db";
import { baseBook, baseMerch } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { bookVariant, merchVariant } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thywilluche.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/books`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/merch`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/coaching`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/consulting`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/ghostwriting`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/custom`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/championship`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/championship/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community/guidelines`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ngo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogPosts = await getPublishedBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const allBooksRaw = await db
    .select({ slug: baseBook.slug, updatedAt: baseBook.updatedAt })
    .from(baseBook)
    .innerJoin(
      bookVariant,
      and(
        eq(bookVariant.baseBookId, baseBook.id),
        eq(bookVariant.isListed, true)
      )
    );

  const uniqueBooks = Array.from(
    new Map(allBooksRaw.map((book) => [book.slug, book])).values()
  );

  const bookRoutes: MetadataRoute.Sitemap = uniqueBooks.map((book) => ({
    url: `${baseUrl}/shop/books/${book.slug}`,
    lastModified: book.updatedAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const allMerchRaw = await db
    .select({ slug: baseMerch.slug, updatedAt: baseMerch.updatedAt })
    .from(baseMerch)
    .innerJoin(
      merchVariant,
      and(
        eq(merchVariant.baseMerchId, baseMerch.id),
        eq(merchVariant.isListed, true)
      )
    );

  const uniqueMerch = Array.from(
    new Map(allMerchRaw.map((item) => [item.slug, item])).values()
  );

  const merchRoutes: MetadataRoute.Sitemap = uniqueMerch.map((item) => ({
    url: `${baseUrl}/shop/merch/${item.slug}`,
    lastModified: item.updatedAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projects = await getPublicProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.id}`,
    lastModified: project.updatedAt || project.date || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...bookRoutes,
    ...merchRoutes,
    ...projectRoutes,
  ];
}
