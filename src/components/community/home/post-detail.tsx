"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Ellipsis,
  HeartIcon,
  MessageSquareIcon,
  Share2Icon,
  ArrowLeft,
  BookmarkIcon,
  FlagIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostById,
  togglePostLike,
  checkPostLikeStatus,
  createShare,
  deletePost,
  reportPost,
} from "@/actions/community/posts";
import PostComments from "./post-comments";
import ImageModal from "./image-modal";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { getUserBadges } from "@/actions/community/games";
import BadgeDisplay from "@/components/shared/badge-display";

interface PostData {
  id: string;
  content: unknown;
  excerpt: string | null;
  images: string[];
  createdAt: Date;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  author: {
    id: string;
    name: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
  } | null;
  group: {
    id: string;
    name: string;
    slug: string;
    type: string;
  } | null;
}

const PostDetail = ({ postId }: { postId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const result = await getPostById(postId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
  });

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="..">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </Button>
          </Link>
        </div>
        <div className="text-center py-20">
          <p className="text-red-500">Failed to load post. Post not found.</p>
        </div>
      </div>
    );
  }

  return <PostContent postId={postId} post={data} />;
};

const PostDetailSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
        <div className="flex gap-3 items-start">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
};

const PostContent = ({ postId, post }: { postId: string; post: PostData }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [localShareCount, setLocalShareCount] = useState(post.shareCount);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: authorBadges } = useQuery({
    queryKey: ["user-badges", post.author?.id],
    queryFn: () => getUserBadges({ userId: post.author?.id || "" }),
    enabled: !!post.author?.id,
  });

  const currentUserId = session?.user?.id;
  const userRole = session?.user?.role;
  const isOwner = post.author?.id === currentUserId;
  const isAdmin = userRole === "ADMIN";
  const canDelete = isOwner || isAdmin;

  const authorName = post.author?.name || "Unknown User";
  const authorImage = post.author?.image || "/images/welcome.png";
  const displayUsername =
    post.author?.displayUsername || post.author?.username || "user";
  const content =
    typeof post.content === "string" ? post.content : post.excerpt || "";
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  const { data: likeStatus } = useQuery({
    queryKey: ["post-like-status", postId],
    queryFn: async () => checkPostLikeStatus({ postId }),
  });

  const isLiked = likeStatus?.liked || false;

  const likeMutation = useMutation({
    mutationFn: async () => togglePostLike({ postId }),
    onMutate: async () => {
      setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["post-like-status", postId],
        });
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      }
    },
    onError: () => {
      setLocalLikeCount(post.likeCount);
      toast.error("Failed to like post");
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => createShare({ postId }),
    onMutate: async () => {
      setLocalShareCount((prev) => prev + 1);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      }
    },
    onError: () => {
      setLocalShareCount(post.shareCount);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => deletePost({ postId }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        router.push("/community/home");
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/community/home/posts/${postId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${authorName}`,
          text: content.substring(0, 100),
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

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const navigateImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const result = await reportPost({
        postId,
        reason: reportReason,
        description: reportDescription,
      });

      if (result.success) {
        toast.success(result.message);
        setShowReportDialog(false);
        setReportReason("");
        setReportDescription("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="..">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex gap-3 items-start mb-4">
            <Image
              src={authorImage}
              alt={authorName}
              width={48}
              height={48}
              className="rounded-full aspect-square object-cover cursor-pointer"
              onClick={() =>
                router.push(`/community/profile/${displayUsername}`)
              }
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className="font-semibold text-lg cursor-pointer"
                      onClick={() =>
                        router.push(`/community/profile/${displayUsername}`)
                      }
                    >
                      {authorName}
                    </p>
                    {authorBadges?.data && authorBadges.data.length > 0 && (
                      <BadgeDisplay
                        // @ts-expect-error nothing
                        badges={
                          authorBadges.data.map((badge) => badge.badge) || []
                        }
                        maxDisplay={2}
                        size="sm"
                      />
                    )}
                  </div>
                  <p
                    className="text-sm text-muted-foreground italic cursor-pointer"
                    onClick={() =>
                      router.push(`/community/profile/${displayUsername}`)
                    }
                  >
                    @{displayUsername}
                  </p>
                  <p
                    className="text-xs text-muted-foreground cursor-pointer"
                    onClick={() =>
                      router.push(`/community/profile/${displayUsername}`)
                    }
                  >
                    {formattedDate}
                    {post.group && ` · ${post.group.name}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <BookmarkIcon
                      className={`w-4 h-4 ${
                        isBookmarked ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <FlagIcon className="w-4 h-4" />
                  </Button>
                  {canDelete ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This
                            action cannot be undone and will permanently remove
                            the post and all associated comments, likes, and
                            shares.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteMutation.isPending
                              ? "Deleting..."
                              : "Delete Post"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mb-4">
              {post.images.length === 1 ? (
                <div className="max-w-2xl">
                  <button
                    onClick={() => openImageModal(0)}
                    className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={post.images[0]}
                      alt={authorName}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-w-2xl">
                  {post.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <button
                        onClick={() => openImageModal(index)}
                        className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={image}
                          alt={`${authorName} image ${index + 1}`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                      {index === 3 && post.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg pointer-events-none">
                          <span className="text-white font-semibold text-lg">
                            +{post.images.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
              >
                <HeartIcon
                  className={`w-4 h-4 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{localLikeCount}</span>
              </Button>
              <Button variant="ghost" className="gap-2">
                <MessageSquareIcon className="w-4 h-4" />
                <span>{post.commentCount}</span>
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={handleShare}
                disabled={shareMutation.isPending}
              >
                <Share2Icon className="w-4 h-4" />
                <span>{localShareCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PostComments postId={postId} />
      </div>

      {post.images && post.images.length > 0 && (
        <ImageModal
          images={post.images}
          currentIndex={currentImageIndex}
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
          onNavigate={navigateImage}
        />
      )}

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
            <DialogDescription>
              Help us understand what&apos;s wrong with this post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam or misleading</SelectItem>
                  <SelectItem value="harassment">
                    Harassment or hate speech
                  </SelectItem>
                  <SelectItem value="inappropriate">
                    Inappropriate content
                  </SelectItem>
                  <SelectItem value="violence">
                    Violence or dangerous content
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Additional details (optional)</Label>
              <Textarea
                id="description"
                placeholder="Provide more context about why you're reporting this post..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
              disabled={isSubmittingReport}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReportSubmit}
              disabled={isSubmittingReport || !reportReason}
            >
              {isSubmittingReport ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetail;
