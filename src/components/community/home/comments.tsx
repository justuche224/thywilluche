import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HeartIcon,
  MessageSquareIcon,
  MoreHorizontal,
  ReplyIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Comment {
  id: string;
  content: string;
  author: string;
  authorImage: string;
  authorUsername: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

interface CommentsProps {
  postId: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "This is absolutely beautiful! I love how you captured the essence of poetry in your words. The imagery is stunning and the rhythm flows so naturally.",
    author: "Sarah Johnson",
    authorImage: "/images/IMG_20250716_093443[1].jpg",
    authorUsername: "sarah_j",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        content: "Thank you so much! I really appreciate your kind words.",
        author: "John Doe",
        authorImage: "/images/IMG_20250716_093443[1].jpg",
        authorUsername: "john_doe",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 3,
        isLiked: true,
        replies: [],
      },
      {
        id: "1-2",
        content:
          "I agree completely! The way the metaphors are woven together is masterful.",
        author: "Mike Chen",
        authorImage: "/images/IMG_20250716_093443[1].jpg",
        authorUsername: "mike_chen",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: "1-2-1",
            content:
              "Exactly! It reminds me of classic poetry but with a modern twist.",
            author: "Emma Wilson",
            authorImage: "/images/IMG_20250716_093443[1].jpg",
            authorUsername: "emma_w",
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
            likes: 2,
            isLiked: false,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    content:
      "The emotional depth in this piece is incredible. It really speaks to the human experience in such a profound way.",
    author: "Alex Rodriguez",
    authorImage: "/images/IMG_20250716_093443[1].jpg",
    authorUsername: "alex_r",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8,
    isLiked: false,
    replies: [],
  },
  {
    id: "3",
    content:
      "I've been following your work for a while now, and this is definitely one of your best pieces. The way you play with language is just... wow!",
    author: "Lisa Thompson",
    authorImage: "/images/IMG_20250716_093443[1].jpg",
    authorUsername: "lisa_t",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 15,
    isLiked: true,
    replies: [
      {
        id: "3-1",
        content:
          "Thank you for the support! It means a lot coming from another writer.",
        author: "John Doe",
        authorImage: "/images/IMG_20250716_093443[1].jpg",
        authorUsername: "john_doe",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 4,
        isLiked: false,
        replies: [],
      },
    ],
  },
];

const Comments = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  console.log(postId);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: "Current User",
      authorImage: "/images/IMG_20250716_093443[1].jpg",
      authorUsername: "current_user",
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Comment = {
      id: `${commentId}-${Date.now()}`,
      content: replyContent,
      author: "Current User",
      authorImage: "/images/IMG_20250716_093443[1].jpg",
      authorUsername: "current_user",
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
    };

    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: updateComments(comment.replies) };
        }
        return comment;
      });
    };

    setComments(updateComments(comments));
    setReplyContent("");
    setReplyingTo(null);
  };

  const toggleLike = (commentId: string) => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: updateComments(comment.replies) };
        }
        return comment;
      });
    };

    setComments(updateComments(comments));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const isMaxDepth = depth >= 3;

    return (
      <div
        className={`${depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}
      >
        <div className="flex gap-3 py-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.authorImage} alt={comment.author} />
            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                @{comment.authorUsername}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1"
                onClick={() => toggleLike(comment.id)}
              >
                <HeartIcon
                  className={`w-3 h-3 ${
                    comment.isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-xs">{comment.likes}</span>
              </Button>

              {!isMaxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-1"
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                >
                  <ReplyIcon className="w-3 h-3" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}

              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder={`Reply to ${comment.author}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies.length > 0 && (
          <div className="space-y-1">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Comments ({comments.length})
        </h3>

        <div className="space-y-2 mb-6">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Comment
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquareIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
