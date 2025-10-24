"use client";

import React, { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
  Inbox,
  Flag,
  Bookmark,
  Trash2,
} from "lucide-react";
import { Top } from "./top";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getFeed,
  togglePostLike,
  checkPostLikeStatus,
  createShare,
  deletePost,
  reportPost,
} from "@/actions/community/posts";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getUserBadges } from "@/actions/community/games";
import BadgeDisplay from "@/components/shared/badge-display";

interface Post {
  id: string;
  content: unknown;
  excerpt: string | null;
  images: string[];
  createdAt: Date;
  publishedAt: Date | null;
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

type FetchAction = (args: {
  page: number;
  limit: number;
  groupId?: string;
  authorId?: string;
  sort?: string;
  sortBy?: string;
}) => Promise<{
  page: number;
  limit: number;
  groupId?: string;
  authorId?: string;
  sort?: string;
  sortBy?: string;
  data: Post[];
  total: number;
  success: boolean;
  message: string;
}>;

const Posts = ({
  groupId,
  userId,
  displayName,
  fetchAction,
  showNewButton = true,
}: {
  groupId?: string;
  userId?: string;
  displayName?: string;
  showNewButton?: boolean;
  fetchAction?: FetchAction;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["community-posts", groupId, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const action = fetchAction || getFeed;
      const result = await action({
        page: pageParam,
        limit: 10,
        groupId,
        authorId: userId,
        sort: "desc",
        sortBy: "pinned",
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.data.length === lastPage.limit;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts =
    data?.pages.flatMap((page) => page.data.filter((p) => p.author !== null)) ??
    [];
  const isEmpty = !isLoading && allPosts.length === 0;

  return (
    <div className="w-full p-5 h-full">
      <div className="w-full mt-10">
        {showNewButton && <Top />}
        {displayName && (
          <h3 className="text-2xl font-bold text-center mt-10">
            Posts by {displayName}
          </h3>
        )}
        <Separator className="my-5 bg-[#800000]" />
      </div>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <PostsSkeleton />
        ) : isEmpty ? (
          <EmptyState userId={userId} />
        ) : (
          <>
            {allPosts.map((post) => (
              <div key={post.id} className="w-full max-w-2xl mx-auto">
                <PostCard post={post} />
                <Separator className="my-5 bg-[#800000]" />
              </div>
            ))}

            {isFetchingNextPage && <PostsSkeleton count={2} />}

            <div ref={observerRef} className="h-10" />
          </>
        )}

        {isError && (
          <div className="text-center py-10">
            <p className="text-red-500">
              Failed to load posts. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;

const PostsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full max-w-2xl mx-auto">
          <div className="w-full space-y-4">
            <div className="flex gap-2 items-center">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Separator className="my-5 bg-[#800000]" />
        </div>
      ))}
    </>
  );
};

const EmptyState = ({ userId }: { userId?: string }) => {
  return (
    <div className="w-full max-w-md mx-auto py-20 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="p-6 bg-gray-100 rounded-full">
          <Inbox className="w-12 h-12 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">No posts yet</h3>
          {userId ? (
            <p className="text-gray-500">
              Be the first to share something with the community!
            </p>
          ) : (
            <p className="text-gray-500">No posts yet</p>
          )}
        </div>
        <Button className="mt-4" asChild>
          <Link href="/community/home/posts/new">Create Post</Link>
        </Button>
      </div>
    </div>
  );
};

const PostMenu = ({
  postId,
  onShare,
  onDelete,
  isOwner,
  isAdmin,
  isDeleting,
}: {
  postId: string;
  onShare: (e: React.MouseEvent) => void;
  onDelete: () => void;
  isOwner: boolean;
  isAdmin: boolean;
  isDeleting: boolean;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReportDialog(true);
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

  const handleSave = () => {
    toast.info("Save functionality coming soon!");
  };

  const handleMenuShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare(e);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Ellipsis className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReportClick(e);
            }}
          >
            <Flag className="w-4 h-4 mr-2" />
            Report
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMenuShare(e);
            }}
          >
            <Share2Icon className="w-4 h-4 mr-2" />
            Share
          </DropdownMenuItem>
          {(isOwner || isAdmin) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone and will permanently remove the post and all associated
              comments, likes, and shares.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [localShareCount, setLocalShareCount] = useState(post.shareCount);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: authorBadges } = useQuery({
    queryKey: ["user-badges", post.author?.id],
    queryFn: () => getUserBadges({ userId: post.author?.id || "" }),
    enabled: !!post.author?.id,
  });

  const displayUsername =
    post.author?.displayUsername || post.author?.username || "user";
  const authorImage = post.author?.image || "/images/welcome.png";
  const authorName = post.author?.name || "Unknown User";
  const currentUserId = session?.user?.id;
  const userRole = session?.user?.role;
  const isOwner = post.author?.id === currentUserId;
  const isAdmin = userRole === "ADMIN";

  const handlePostClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    router.push(`/community/home/posts/${post.id}`);
  };

  const { data: likeStatus } = useQuery({
    queryKey: ["post-like-status", post.id],
    queryFn: async () => checkPostLikeStatus({ postId: post.id }),
  });

  const isLiked = likeStatus?.liked || false;

  const likeMutation = useMutation({
    mutationFn: async () => togglePostLike({ postId: post.id }),
    onMutate: async () => {
      setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["post-like-status", post.id],
        });
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      }
    },
    onError: () => {
      setLocalLikeCount(post.likeCount);
      toast.error("Failed to like post");
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => createShare({ postId: post.id }),
    onMutate: async () => {
      setLocalShareCount((prev) => prev + 1);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
        queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      }
    },
    onError: () => {
      setLocalShareCount(post.shareCount);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => deletePost({ postId: post.id }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/community/home/posts/${post.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${authorName}`,
          text:
            typeof post.content === "string"
              ? post.content.substring(0, 100)
              : post.excerpt || "",
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

  return (
    <div className="w-full" onClick={handlePostClick}>
      <div className="w-full flex gap-2 items-center">
        <Image
          src={authorImage}
          alt={authorName}
          width={32}
          height={32}
          className="rounded-full aspect-square object-cover"
        />
        <div className="w-full flex items-center justify-between">
          <Link
            href={`/community/profile/${displayUsername}`}
            className="flex items-center gap-2"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">{authorName}</p>
                {authorBadges?.data && authorBadges.data.length > 0 && (
                  <BadgeDisplay
                    // @ts-expect-error nothing
                    badges={authorBadges.data.map((badge) => badge.badge) || []}
                    maxDisplay={2}
                    size="sm"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground italic">
                @{displayUsername}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {post.group && (
              <span className="text-xs bg-[#800000] text-white px-2 py-1 rounded-full">
                {post.group.name}
              </span>
            )}
            <PostMenu
              postId={post.id}
              onShare={handleShare}
              onDelete={() => deleteMutation.mutate()}
              isOwner={isOwner}
              isAdmin={isAdmin}
              isDeleting={deleteMutation.isPending}
            />
          </div>
        </div>
      </div>
      {post.images && post.images.length > 0 ? (
        <PostWithImage post={post} />
      ) : (
        <PostWithoutImage post={post} />
      )}
      <div className="w-full flex gap-2 items-center justify-between p-2 px-1">
        <div>
          <Link href={`/community/home/posts/${post.id}`}>
            <Button variant={"ghost"} size={"icon"}>
              <p className="text-sm">{post.commentCount}</p>
              <MessageSquareIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              likeMutation.mutate();
            }}
            disabled={likeMutation.isPending}
          >
            <p className="text-sm">{localLikeCount}</p>
            <HeartIcon
              className={`w-4 h-4 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>
        <div>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handleShare}
            disabled={shareMutation.isPending}
          >
            <p className="text-sm">{localShareCount}</p>
            <Share2Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const PostWithImage = ({ post }: { post: Post }) => {
  const content =
    typeof post.content === "string" ? post.content : post.excerpt || "";
  const authorName = post.author?.name || "Unknown User";
  const images = post.images || [];
  const displayImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <div className="w-full flex flex-col-reverse sm:flex-row gap-3 py-3">
      <div className="w-full sm:w-1/3">
        {images.length === 1 ? (
          <Image
            src={images[0]}
            alt={authorName}
            width={400}
            height={400}
            className="w-full h-full object-cover aspect-square rounded-lg"
          />
        ) : images.length === 2 ? (
          <div className="grid grid-cols-2 gap-1 h-full">
            {images.map((image, index) => (
              <div key={index} className="relative h-full">
                <Image
                  src={image}
                  alt={`${authorName} image ${index + 1}`}
                  width={200}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {displayImages.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image}
                  alt={`${authorName} image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
                {index === 3 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <span className="text-white font-semibold text-lg">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full sm:w-2/3">
        <p className="text-sm line-clamp-[10]">{content}</p>
      </div>
    </div>
  );
};

const PostWithoutImage = ({ post }: { post: Post }) => {
  const content =
    typeof post.content === "string" ? post.content : post.excerpt || "";

  return (
    <div className="w-full py-3">
      <p className="text-sm line-clamp-[10]">{content}</p>
    </div>
  );
};
