import { getPublishedBlogPosts } from "@/actions/blog";
import Image from "next/image";
import Link from "next/link";
import { Oswald, Pacifico } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
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
}

const categories = [
  { name: "Poetry", slug: "Poetry" },
  { name: "Essays", slug: "Essays" },
  { name: "Reflections", slug: "Reflections" },
  { name: "Thought Leadership", slug: "Thought Leadership" },
  { name: "Winners of Game", slug: "Winners of Game" },
];

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
            <h1 className={`text-5xl lg:text-6xl ${pacifico.className} mb-6`}>
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
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8 border-b border-gray-200 last:border-b-0">
                    {index % 2 === 0 ? (
                      <>
                        <div className="lg:col-span-5 space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span
                                className={`text-sm text-primary font-semibold ${oswald.className}`}
                              >
                                {post.category}
                              </span>
                              {post.isFeatured && (
                                <span
                                  className={`text-xs bg-primary/10 text-primary px-3 py-1 rounded-full ${oswald.className}`}
                                >
                                  Featured
                                </span>
                              )}
                            </div>
                            <h2
                              className={`text-3xl lg:text-4xl font-bold leading-tight group-hover:text-primary transition-colors ${oswald.className}`}
                            >
                              {post.title}
                            </h2>
                            <p
                              className={`text-lg text-gray-700 leading-relaxed ${oswald.className}`}
                            >
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {post.publishedAt && (
                              <time dateTime={post.publishedAt.toString()}>
                                {new Date(post.publishedAt!).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <span className="text-gray-400">•</span>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <span>{post.tags.slice(0, 2).join(", ")}</span>
                            )}
                          </div>
                        </div>

                        {post.imageUrl && (
                          <div className="lg:col-span-7">
                            <div className="relative aspect-video rounded-2xl overflow-hidden">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {post.imageUrl && (
                          <div className="lg:col-span-7">
                            <div className="relative aspect-video rounded-2xl overflow-hidden">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                          </div>
                        )}

                        <div className="lg:col-span-5 space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span
                                className={`text-sm text-primary font-semibold ${oswald.className}`}
                              >
                                {post.category}
                              </span>
                              {post.isFeatured && (
                                <span
                                  className={`text-xs bg-primary/10 text-primary px-3 py-1 rounded-full ${oswald.className}`}
                                >
                                  Featured
                                </span>
                              )}
                            </div>
                            <h2
                              className={`text-3xl lg:text-4xl font-bold leading-tight group-hover:text-primary transition-colors ${oswald.className}`}
                            >
                              {post.title}
                            </h2>
                            <p
                              className={`text-lg text-gray-700 leading-relaxed ${oswald.className}`}
                            >
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {post.publishedAt && (
                              <time dateTime={post.publishedAt.toString()}>
                                {new Date(post.publishedAt!).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <span className="text-gray-400">•</span>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <span>{post.tags.slice(0, 2).join(", ")}</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
