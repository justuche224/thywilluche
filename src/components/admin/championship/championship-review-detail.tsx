"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface ReviewDetail {
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
    image: string | null;
  };
  registration?: {
    id: string;
    phoneNumber: string;
    country: string;
    state: string;
    city: string;
    address: string;
    status: "pending" | "approved" | "rejected";
  };
}

interface ChampionshipReviewDetailProps {
  review: ReviewDetail;
}

export function ChampionshipReviewDetail({
  review,
}: ChampionshipReviewDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Details</h1>
          <p className="text-muted-foreground">
            View submitted review information
          </p>
        </div>
        <Button asChild variant="outline" className="w-full md:w-auto">
          <Link href="/admin/championship/reviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Submitter Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {review.user?.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-500">
                  {(review.user?.name || review.user?.email || "U")
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-lg">
                  {review.user?.name || "Unknown User"}
                </div>
                {review.user?.username && (
                  <div className="text-sm text-muted-foreground">
                    @{review.user.username}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{review.user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Submitted on{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {review.registration && (
          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Phone:
                </span>{" "}
                <span>{review.registration.phoneNumber}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Location:
                </span>{" "}
                <span>
                  {review.registration.city}, {review.registration.state},{" "}
                  {review.registration.country}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Address:
                </span>{" "}
                <span>{review.registration.address}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Status:
                </span>{" "}
                <span className="capitalize">{review.registration.status}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {review.reviewText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {review.reviewText}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {review.reviewDocumentUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="font-medium">Document uploaded</div>
                  <div className="text-sm text-muted-foreground">
                    PDF or DOCX file
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={review.reviewDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={review.reviewDocumentUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
