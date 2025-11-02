import { getPublishedBlogPosts } from "@/actions/blog";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import BlogPostCard from "@/components/blog/blog-post-card";
import { blogCategories } from "@/db/schema/blog";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
  likeCount: number;
  shareCount: number;
  commentCount: number;
}

const categories = blogCategories.map((cat) => ({ name: cat, slug: cat }));

interface BlogListingPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogListingPage({
  searchParams,
}: BlogListingPageProps) {
  const { category } = await searchParams;
  const posts = await getPublishedBlogPosts(category);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className={`text-5xl lg:text-6xl ${georgiaItalic.className} mb-6`}
            >
              Words & Wisdom
            </h1>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto mb-8"></div>
            <p
              className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
            >
              Poetry, essays, reflections, and thought leadership. Stories that
              inspire, thoughts that challenge, and words that heal.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                href="/blog"
                className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                  oswald.className
                } ${
                  !category
                    ? "bg-primary text-white border-primary"
                    : "hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                    oswald.className
                  } ${
                    category === cat.slug
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-primary hover:text-white hover:border-primary"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            {category && (
              <div className="text-center">
                <p className={`text-lg text-gray-600 ${oswald.className}`}>
                  Showing posts in:{" "}
                  <span className="font-semibold text-primary">
                    {categories.find((cat) => cat.slug === category)?.name ||
                      category}
                  </span>
                </p>
              </div>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className={`text-lg text-gray-600 ${oswald.className}`}>
                {category
                  ? `No posts found in ${
                      categories.find((cat) => cat.slug === category)?.name ||
                      category
                    }.`
                  : "No blog posts published yet. Check back soon for inspiring content."}
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {posts.map((post: BlogPost, index: number) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
