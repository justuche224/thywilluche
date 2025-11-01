"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageSquareIcon, Share2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleBlogPostLike,
  checkBlogPostLikeStatus,
  createBlogShare,
} from "@/actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface BlogInteractionsProps {
  postId: string;
  initialLikeCount: number;
  initialShareCount: number;
  commentCount: number;
  slug: string;
  title: string;
}

const BlogInteractions = ({
  postId,
  initialLikeCount,
  initialShareCount,
  commentCount,
  slug,
  title,
}: BlogInteractionsProps) => {
  const [localLikeCount, setLocalLikeCount] = useState(initialLikeCount);
  const [localShareCount, setLocalShareCount] = useState(initialShareCount);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: likeStatus } = useQuery({
    queryKey: ["blog-post-like-status", postId],
    queryFn: async () => checkBlogPostLikeStatus({ postId }),
  });

  const isLiked = likeStatus?.liked || false;

  const likeMutation = useMutation({
    mutationFn: async () => toggleBlogPostLike({ postId }),
    onMutate: async () => {
      setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["blog-post-like-status", postId],
        });
        queryClient.invalidateQueries({ queryKey: ["blog-post", slug] });
      } else {
        if (result.message.includes("sign in")) {
          toast.error(result.message);
          setTimeout(() => {
            router.push("/auth/login?callbackUrl=/blog/" + slug);
          }, 1500);
        } else {
          toast.error(result.message);
        }
        setLocalLikeCount(initialLikeCount);
      }
    },
    onError: () => {
      setLocalLikeCount(initialLikeCount);
      toast.error("Failed to like post");
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => createBlogShare({ postId }),
    onMutate: async () => {
      setLocalShareCount((prev) => prev + 1);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["blog-post", slug] });
      }
    },
    onError: () => {
      setLocalShareCount(initialShareCount);
    },
  });

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/blog/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this blog post: ${title}`,
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

  const scrollToComments = () => {
    const commentsSection = document.querySelector("h2");
    if (commentsSection && commentsSection.textContent?.includes("Comments")) {
      commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Separator className="my-8" />
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
          >
            <HeartIcon
              className={`w-5 h-5 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span className="text-base">{localLikeCount}</span>
          </Button>
          <Button variant="ghost" className="gap-2" onClick={scrollToComments}>
            <MessageSquareIcon className="w-5 h-5" />
            <span className="text-base">{commentCount}</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={handleShare}
            disabled={shareMutation.isPending}
          >
            <Share2Icon className="w-5 h-5" />
            <span className="text-base">{localShareCount}</span>
          </Button>
        </div>
      </div>
      <Separator className="my-8" />
    </>
  );
};

export default BlogInteractions;
