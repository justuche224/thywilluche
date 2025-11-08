"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getAllChampionshipReviews } from "@/actions/admin/championship";
import { Eye, FileText, User } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  userId: string;
  reviewText: string | null;
  reviewDocumentUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  };
}

export function ChampionshipReviewsList() {
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["championship-reviews"],
    queryFn: () => getAllChampionshipReviews(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load reviews");
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load reviews. Please try again.
      </div>
    );
  }

  if (!reviewsData?.success || !reviewsData.reviews.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews submitted yet.
      </div>
    );
  }

  const reviews = reviewsData.reviews as Review[];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Submission Type</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {review.user?.name || "Unknown User"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.user?.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {review.reviewText && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <FileText className="h-3 w-3" />
                      Text Review
                    </span>
                  )}
                  {review.reviewDocumentUrl && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <FileText className="h-3 w-3" />
                      Document
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/championship/reviews/${review.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
