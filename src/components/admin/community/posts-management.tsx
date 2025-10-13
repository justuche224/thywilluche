"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getPostsForAdmin, updatePostStatus } from "@/actions/admin/community";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Calendar,
  Hash,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export function PostsManagement() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const queryClient = useQueryClient();

  // Handle URL parameters for filtering
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (
      statusParam &&
      ["pending", "approved", "rejected"].includes(statusParam)
    ) {
      setStatus(statusParam as "pending" | "approved" | "rejected");
    }
  }, [searchParams]);

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-posts", page, status, search],
    queryFn: () =>
      getPostsForAdmin({
        page,
        limit: 10,
        status: status === "all" ? undefined : status,
        search: search || undefined,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: updatePostStatus,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update post status");
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatus(value as typeof status);
    setPage(1);
  };

  const handleStatusUpdate = (
    postId: string,
    newStatus: "approved" | "rejected"
  ) => {
    updateStatusMutation.mutate({ postId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load posts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Community", href: "/admin/community" },
          { label: "Posts", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Posts Management</h1>
            <HelpTooltip content="Review and approve posts submitted by community members. All posts need admin approval before they become visible to users." />
          </div>
          <p className="text-muted-foreground">
            Review and manage community posts
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Filters</CardTitle>
            <HelpTooltip content="Use these filters to find specific posts. Search by content or filter by approval status." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search posts..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Select value={status} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                      <Skeleton className="h-6 w-[80px]" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-[60px]" />
                        <Skeleton className="h-4 w-[60px]" />
                        <Skeleton className="h-4 w-[60px]" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-[80px]" />
                        <Skeleton className="h-8 w-[80px]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : postsData?.data && postsData.data.length > 0 ? (
          postsData.data.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {post.author?.image && (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {post.author?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @
                          {post.author?.displayUsername ||
                            post.author?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(post.status)}
                      <Link href={`/community/home/posts/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">
                      {String(post.content)}
                    </p>

                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {post.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <Image
                              src={image}
                              alt={`Post image ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ))}
                        {post.images.length > 4 && (
                          <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg">
                            <span className="text-sm text-gray-600">
                              +{post.images.length - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span>{post.shareCount}</span>
                      </div>
                      {post.group && (
                        <div className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          <span>{post.group.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {post.status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(post.id, "approved")}
                        disabled={updateStatusMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(post.id, "rejected")}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No posts found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {postsData &&
        postsData.total &&
        postsData.limit &&
        postsData.total > postsData.limit && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {Math.ceil(postsData.total / postsData.limit)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(postsData.total / postsData.limit)}
            >
              Next
            </Button>
          </div>
        )}
    </div>
  );
}
