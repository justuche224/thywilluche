import { getBlogPostBySlug } from "@/actions/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import React from "react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface ContentNode {
  type: string;
  content?: ContentNode[];
  text?: string;
  attrs?: Record<string, string | number>;
  marks?: Array<{ type: string }>;
}

function renderContent(content: ContentNode, index = 0): React.ReactNode {
  if (!content || !content.type) return null;

  if (content.type === "doc" && content.content) {
    return (
      <div className="prose prose-lg max-w-none">
        {content.content.map((node, idx) => (
          <div key={idx}>{renderContent(node, idx)}</div>
        ))}
      </div>
    );
  }

  if (content.type === "paragraph") {
    if (!content.content || content.content.length === 0) {
      return (
        <p key={index} className={`mb-6 ${oswald.className}`}>
          &nbsp;
        </p>
      );
    }
    return (
      <p
        key={index}
        className={`mb-6 text-lg leading-relaxed text-gray-700 ${oswald.className}`}
      >
        {content.content?.map((node, idx) => renderContent(node, idx))}
      </p>
    );
  }

  if (content.type === "heading") {
    const level = (content.attrs?.level as number) || 1;
    const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const headingClasses = {
      1: `text-4xl lg:text-5xl font-bold mb-8 mt-12 ${georgiaItalic.className}`,
      2: `text-3xl lg:text-4xl font-bold mb-6 mt-10 ${oswald.className}`,
      3: `text-2xl lg:text-3xl font-semibold mb-4 mt-8 ${oswald.className}`,
      4: `text-xl lg:text-2xl font-semibold mb-4 mt-6 ${oswald.className}`,
      5: `text-lg lg:text-xl font-semibold mb-3 mt-4 ${oswald.className}`,
      6: `text-base lg:text-lg font-semibold mb-3 mt-4 ${oswald.className}`,
    };
    return React.createElement(
      Component,
      {
        className:
          headingClasses[level as keyof typeof headingClasses] ||
          headingClasses[1],
        key: index,
      },
      content.content?.map((node, idx) => renderContent(node, idx))
    );
  }

  if (content.type === "text") {
    let textContent: React.ReactNode = content.text;
    if (content.marks) {
      for (const mark of content.marks) {
        if (mark.type === "bold") {
          textContent = (
            <strong key={index} className="font-semibold">
              {textContent}
            </strong>
          );
        }
        if (mark.type === "italic") {
          textContent = (
            <em key={index} className="italic">
              {textContent}
            </em>
          );
        }
        if (mark.type === "code") {
          textContent = (
            <code
              key={index}
              className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
            >
              {textContent}
            </code>
          );
        }
      }
    }
    return textContent;
  }

  if (content.type === "bulletList") {
    return (
      <ul
        key={index}
        className={`list-disc pl-8 mb-6 space-y-2 ${oswald.className}`}
      >
        {content.content?.map((node, idx) => (
          <li key={idx} className="text-lg leading-relaxed text-gray-700">
            {renderContent(node, idx)}
          </li>
        ))}
      </ul>
    );
  }

  if (content.type === "orderedList") {
    return (
      <ol
        key={index}
        className={`list-decimal pl-8 mb-6 space-y-2 ${oswald.className}`}
      >
        {content.content?.map((node, idx) => (
          <li key={idx} className="text-lg leading-relaxed text-gray-700">
            {renderContent(node, idx)}
          </li>
        ))}
      </ol>
    );
  }

  if (content.type === "listItem") {
    return content.content?.map((node, idx) => renderContent(node, idx));
  }

  if (content.type === "codeBlock") {
    return (
      <pre
        key={index}
        className="bg-gray-900 text-gray-100 p-6 rounded-2xl mb-8 overflow-x-auto"
      >
        <code className="text-sm font-mono">
          {content.content?.map((node) => node.text).join("")}
        </code>
      </pre>
    );
  }

  if (content.type === "blockquote") {
    return (
      <blockquote
        key={index}
        className={`border-l-4 border-primary pl-8 py-4 mb-8 italic text-xl text-gray-600 bg-gray-50 rounded-r-2xl ${georgiaItalic.className}`}
      >
        {content.content?.map((node, idx) => renderContent(node, idx))}
      </blockquote>
    );
  }

  if (content.type === "image") {
    return (
      <div key={index} className="relative w-full my-12">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={content.attrs?.src?.toString() || ""}
            alt={content.attrs?.alt?.toString() || ""}
            fill
            className="object-cover"
          />
        </div>
        {content.attrs?.alt && (
          <p
            className={`text-sm text-gray-500 mt-3 text-center ${oswald.className}`}
          >
            {content.attrs.alt}
          </p>
        )}
      </div>
    );
  }

  return null;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <div className="w-full relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <Button
            asChild
            variant="ghost"
            className={`mb-12 ${oswald.className}`}
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Words & Wisdom
            </Link>
          </Button>

          <article className="space-y-12">
            <header className="space-y-8">
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

              <h1
                className={`text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight ${georgiaItalic.className}`}
              >
                {post.title}
              </h1>

              <p
                className={`text-xl lg:text-2xl text-gray-700 leading-relaxed ${oswald.className}`}
              >
                {post.excerpt}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt.toString()}
                    className={oswald.className}
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className={oswald.className}>
                      {post.tags.slice(0, 3).join(", ")}
                    </span>
                  </>
                )}
              </div>
            </header>

            {post.imageUrl && (
              <div className="relative w-full">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            )}

            <div className="max-w-none">
              {renderContent(post.content as ContentNode)}
            </div>

            {post.tags && post.tags.length > 0 && (
              <footer className="border-t border-gray-200 pt-12">
                <h3
                  className={`text-lg font-semibold mb-6 ${oswald.className}`}
                >
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(post.tags as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm ${oswald.className} hover:bg-primary hover:text-white transition-colors cursor-pointer`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
