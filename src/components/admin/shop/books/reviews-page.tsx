"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Star, Trash2, Pencil } from "lucide-react";
import { georgiaItalic } from "@/utils/georgia-italic";
import { Oswald } from "next/font/google";
import {
  getBookReviews,
  addBookReview,
  updateBookReview,
  deleteBookReview,
} from "@/actions/shop/books/reviews";
import { getBaseBook } from "@/actions/shop/books/admin-new";
import { toast } from "sonner";
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

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface ReviewsPageProps {
  bookId: string;
}

export const ReviewsPage = ({ bookId }: ReviewsPageProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState("");
  const [content, setContent] = useState("");
  const [showOnHomePage, setShowOnHomePage] = useState(false);
  const queryClient = useQueryClient();

  const { data: bookData } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBaseBook(bookId),
  });

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["book-reviews", bookId],
    queryFn: () => getBookReviews(bookId),
  });

  const addReviewMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await addBookReview(formData);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.message || result.error);
      } else {
        toast.success(result.message || "Review added successfully");
        setIsDialogOpen(false);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["book-reviews", bookId] });
      }
    },
    onError: () => {
      toast.error("Failed to add review");
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await updateBookReview(formData);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.message || result.error);
      } else {
        toast.success(result.message || "Review updated successfully");
        setIsDialogOpen(false);
        setEditingReview(null);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["book-reviews", bookId] });
      }
    },
    onError: () => {
      toast.error("Failed to update review");
    },
  });

  const resetForm = () => {
    setReviewerName("");
    setRating("");
    setContent("");
    setShowOnHomePage(false);
  };

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return await deleteBookReview(reviewId);
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.message || result.error);
      } else {
        toast.success(result.message || "Review deleted successfully");
        setReviewToDelete(null);
        queryClient.invalidateQueries({ queryKey: ["book-reviews", bookId] });
      }
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  const handleEdit = (review: (typeof reviews)[0]) => {
    setEditingReview(review.id);
    setReviewerName(review.reviewerName);
    setRating(review.rating.toString());
    setContent(review.content);
    setShowOnHomePage(review.showOnHomePage || false);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName || !rating || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    const formData = new FormData();
    if (editingReview) {
      formData.append("id", editingReview);
      formData.append("reviewerName", reviewerName);
      formData.append("rating", rating);
      formData.append("content", content);
      formData.append("showOnHomePage", showOnHomePage.toString());
      updateReviewMutation.mutate(formData);
    } else {
      formData.append("baseBookId", bookId);
      formData.append("reviewerName", reviewerName);
      formData.append("rating", rating);
      formData.append("content", content);
      formData.append("showOnHomePage", showOnHomePage.toString());
      addReviewMutation.mutate(formData);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingReview(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (reviewToDelete) {
      deleteReviewMutation.mutate(reviewToDelete);
    }
  };

  const book = bookData?.book;
  const reviews = reviewsData?.reviews || [];

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl lg:text-4xl xl:text-5xl ${georgiaItalic.className} font-bold text-gray-900 mb-2`}
          >
            Reviews
            {book && (
              <span className="text-xl text-muted-foreground ml-2">
                - {book.tittle}
              </span>
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Manage reviews for this book
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? "Edit Review" : "Add New Review"}
              </DialogTitle>
              <DialogDescription>
                {editingReview
                  ? "Update the reviewer information and review details"
                  : "Enter the reviewer information and review details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewerName">Reviewer Name</Label>
                  <Input
                    id="reviewerName"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter reviewer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="Enter rating (1-5)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Review Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter review content"
                    rows={5}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showOnHomePage"
                    checked={showOnHomePage}
                    onCheckedChange={(checked) =>
                      setShowOnHomePage(checked === true)
                    }
                  />
                  <Label
                    htmlFor="showOnHomePage"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Show on home page
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    addReviewMutation.isPending ||
                    updateReviewMutation.isPending
                  }
                >
                  {addReviewMutation.isPending || updateReviewMutation.isPending
                    ? editingReview
                      ? "Updating..."
                      : "Adding..."
                    : editingReview
                    ? "Update Review"
                    : "Add Review"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="container mx-auto max-w-7xl px-2 md:px-5 lg:px-10 bg-white py-10 rounded-lg">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No reviews yet</p>
            <p className="text-muted-foreground">
              Add your first review using the button above
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 border rounded-lg space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`text-xl font-semibold ${oswald.className}`}
                      >
                        {review.reviewerName}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {review.content}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      {review.showOnHomePage && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          On Home Page
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(review)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setReviewToDelete(review.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={reviewToDelete !== null}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
