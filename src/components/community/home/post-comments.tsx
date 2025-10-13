"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostComments,
  getCommentReplies,
  createComment,
  toggleCommentLike,
  deleteComment,
  checkCommentLikeStatus,
} from "@/actions/community/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  HeartIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  likeCount: number;
  replyCount: number;
  author: {
    id: string;
    name: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
  } | null;
}

const PostComments = ({ postId }: { postId: string }) => {
  const [commentContent, setCommentContent] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const result = await getPostComments({ postId, page: 1, limit: 20 });
      return result;
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await createComment({ postId, content });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setCommentContent("");
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });

  const handleSubmitComment = () => {
    if (commentContent.trim()) {
      createCommentMutation.mutate(commentContent);
    }
  };

  if (isLoading) {
    return <CommentsSkeleton />;
  }

  if (isError || !data?.success) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load comments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({data.total})</h2>

      {/* Comment Form */}
      <div className="space-y-3">
        <Textarea
          placeholder="Write a comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={createCommentMutation.isPending}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!commentContent.trim() || createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {data.data.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {data.data.map((comment) => (
            <Comment key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};

const Comment = ({
  comment,
  postId,
}: {
  comment: CommentData;
  postId: string;
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount);
  const queryClient = useQueryClient();

  const { data: likeStatus } = useQuery({
    queryKey: ["comment-like-status", comment.id],
    queryFn: async () => checkCommentLikeStatus({ commentId: comment.id }),
  });

  const isLiked = likeStatus?.liked || false;

  const authorName = comment.author?.name || "Unknown User";
  const authorImage = comment.author?.image || "/images/welcome.png";
  const displayUsername =
    comment.author?.displayUsername || comment.author?.username || "user";
  const formattedDate = new Date(comment.createdAt).toLocaleDateString();

  const likeMutation = useMutation({
    mutationFn: async () => toggleCommentLike({ commentId: comment.id }),
    onMutate: async () => {
      // Optimistic update
      setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["comment-like-status", comment.id],
        });
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      }
    },
    onError: () => {
      // Revert optimistic update
      setLocalLikeCount(comment.likeCount);
      toast.error("Failed to like comment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => deleteComment({ commentId: comment.id }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      return await createComment({
        postId,
        content,
        parentId: comment.id,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setReplyContent("");
        setShowReplyForm(false);
        setShowReplies(true);
        queryClient.invalidateQueries({
          queryKey: ["comment-replies", comment.id],
        });
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to post reply");
    },
  });

  const handleReply = () => {
    if (replyContent.trim()) {
      replyMutation.mutate(replyContent);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={authorImage}
            alt={authorName}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                @{displayUsername}
              </p>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            {comment.isEdited && <span>(edited)</span>}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 gap-1"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <HeartIcon
                className={`w-3 h-3 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{localLikeCount}</span>
            </Button>
            <button
              className="hover:underline"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            {comment.replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 gap-1"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                <span>
                  {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}
                </span>
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="space-y-2 mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] resize-none text-sm"
                disabled={replyMutation.isPending}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  disabled={replyMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim() || replyMutation.isPending}
                >
                  {replyMutation.isPending ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Reply"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReplies && comment.replyCount > 0 && (
        <div className="ml-12 space-y-4">
          <CommentReplies commentId={comment.id} postId={postId} />
        </div>
      )}
    </div>
  );
};

const CommentReplies = ({
  commentId,
  postId,
}: {
  commentId: string;
  postId: string;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["comment-replies", commentId],
    queryFn: async () => {
      const result = await getCommentReplies({ commentId, page: 1, limit: 10 });
      return result;
    },
    enabled: true,
  });

  if (isLoading) {
    return <RepliesSkeleton />;
  }

  if (isError || !data?.success) {
    return <div className="text-sm text-red-500">Failed to load replies.</div>;
  }

  return (
    <div className="space-y-4">
      {data.data.map((reply) => (
        <Reply key={reply.id} reply={reply} postId={postId} />
      ))}
    </div>
  );
};

const Reply = ({ reply, postId }: { reply: CommentData; postId: string }) => {
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [localLikeCount, setLocalLikeCount] = useState(reply.likeCount);
  const queryClient = useQueryClient();

  const { data: likeStatus } = useQuery({
    queryKey: ["comment-like-status", reply.id],
    queryFn: async () => checkCommentLikeStatus({ commentId: reply.id }),
  });

  const isLiked = likeStatus?.liked || false;

  const authorName = reply.author?.name || "Unknown User";
  const authorImage = reply.author?.image || "/images/welcome.png";
  const displayUsername =
    reply.author?.displayUsername || reply.author?.username || "user";
  const formattedDate = new Date(reply.createdAt).toLocaleDateString();

  const likeMutation = useMutation({
    mutationFn: async () => toggleCommentLike({ commentId: reply.id }),
    onMutate: async () => {
      setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["comment-like-status", reply.id],
        });
      }
    },
    onError: () => {
      setLocalLikeCount(reply.likeCount);
      toast.error("Failed to like reply");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => deleteComment({ commentId: reply.id }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["comment-replies"] });
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete reply");
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      return await createComment({
        postId,
        content,
        parentId: reply.id,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setReplyContent("");
        setShowReplyForm(false);
        setShowNestedReplies(true);
        queryClient.invalidateQueries({
          queryKey: ["comment-replies", reply.id],
        });
        queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to post reply");
    },
  });

  const handleReply = () => {
    if (replyContent.trim()) {
      replyMutation.mutate(replyContent);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={authorImage}
            alt={authorName}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-xs">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                @{displayUsername}
              </p>
            </div>
            <p className="text-xs">{reply.content}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            {reply.isEdited && <span>(edited)</span>}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-0.5 px-1 gap-1"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <HeartIcon
                className={`w-3 h-3 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{localLikeCount}</span>
            </Button>
            <button
              className="hover:underline"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-0.5 px-1"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            {reply.replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-0.5 px-1 gap-1"
                onClick={() => setShowNestedReplies(!showNestedReplies)}
              >
                {showNestedReplies ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                <span>
                  {reply.replyCount}{" "}
                  {reply.replyCount === 1 ? "reply" : "replies"}
                </span>
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="space-y-2 mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] resize-none text-xs"
                disabled={replyMutation.isPending}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  disabled={replyMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim() || replyMutation.isPending}
                >
                  {replyMutation.isPending ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Reply"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNestedReplies && reply.replyCount > 0 && (
        <div className="ml-8 space-y-3">
          <CommentReplies commentId={reply.id} postId={postId} />
        </div>
      )}
    </div>
  );
};

const CommentsSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

const RepliesSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostComments;
