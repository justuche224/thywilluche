"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HeartIcon, MessageSquareIcon, Share2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleBlogPostLike,
  checkBlogPostLikeStatus,
  createBlogShare,
} from "@/actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";

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

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [localShareCount, setLocalShareCount] = useState(post.shareCount);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: likeStatus } = useQuery({
    queryKey: ["blog-post-like-status", post.id],
    queryFn: async () => checkBlogPostLikeStatus({ postId: post.id }),
  });

  const isLiked = likeStatus?.liked || false;

  const likeMutation = useMutation({
    mutationFn: async () => toggleBlogPostLike({ postId: post.id }),
    onMutate: async () => {
      setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["blog-post-like-status", post.id],
        });
        router.refresh();
      } else {
        if (result.message.includes("sign in")) {
          toast.error(result.message);
          setTimeout(() => {
            router.push("/auth/login?callbackUrl=/blog/" + post.slug);
          }, 1500);
        } else {
          toast.error(result.message);
        }
        setLocalLikeCount(post.likeCount);
      }
    },
    onError: () => {
      setLocalLikeCount(post.likeCount);
      toast.error("Failed to like post");
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => createBlogShare({ postId: post.id }),
    onMutate: async () => {
      setLocalShareCount((prev) => prev + 1);
    },
    onSuccess: (result) => {
      if (result.success) {
        router.refresh();
      }
    },
    onError: () => {
      setLocalShareCount(post.shareCount);
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMutation.mutate();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/blog/${post.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this blog post: ${post.title}`,
          url: postUrl,
        });
        shareMutation.mutate();
        toast.success("Post shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        shareMutation.mutate();
        toast.success("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy link");
      }
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/${post.slug}#comments`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    router.push(`/blog/${post.slug}`);
  };

  return (
    <div onClick={handleCardClick} className="group block cursor-pointer">
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
                    {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {post.tags && post.tags.length > 0 && (
                  <span className="text-gray-400">•</span>
                )}
                {post.tags && post.tags.length > 0 && (
                  <span>{post.tags.slice(0, 2).join(", ")}</span>
                )}
              </div>

              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <HeartIcon
                    className={`w-4 h-4 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span className="text-sm">{localLikeCount}</span>
                </button>
                <button
                  onClick={handleComment}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <MessageSquareIcon className="w-4 h-4" />
                  <span className="text-sm">{post.commentCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  disabled={shareMutation.isPending}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Share2Icon className="w-4 h-4" />
                  <span className="text-sm">{localShareCount}</span>
                </button>
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
                    {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {post.tags && post.tags.length > 0 && (
                  <span className="text-gray-400">•</span>
                )}
                {post.tags && post.tags.length > 0 && (
                  <span>{post.tags.slice(0, 2).join(", ")}</span>
                )}
              </div>

              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <HeartIcon
                    className={`w-4 h-4 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span className="text-sm">{localLikeCount}</span>
                </button>
                <button
                  onClick={handleComment}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <MessageSquareIcon className="w-4 h-4" />
                  <span className="text-sm">{post.commentCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  disabled={shareMutation.isPending}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Share2Icon className="w-4 h-4" />
                  <span className="text-sm">{localShareCount}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
