"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBaseBook, getBaseBook } from "@/actions/shop/books/admin-new";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface EditBookPageProps {
  baseBookId: string;
}

export function EditBookPage({ baseBookId }: EditBookPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tropes, setTropes] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentTrope, setCurrentTrope] = useState("");
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["base-book", baseBookId],
    queryFn: () => getBaseBook(baseBookId),
  });

  useEffect(() => {
    if (data?.book) {
      setTags(data.book.tags || []);
    }
    if (data?.tropes) {
      setTropes(data.tropes.map((t) => t.name));
    }
  }, [data]);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTrope = () => {
    if (currentTrope.trim() && !tropes.includes(currentTrope.trim())) {
      setTropes([...tropes, currentTrope.trim()]);
      setCurrentTrope("");
    }
  };

  const removeTrope = (tropeToRemove: string) => {
    setTropes(tropes.filter((trope) => trope !== tropeToRemove));
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    formData.set("id", baseBookId);
    formData.delete("tags");
    formData.delete("trope");

    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    tropes.forEach((trope) => {
      formData.append("trope", trope);
    });

    try {
      const result = await updateBaseBook(formData);
      if (result.message) {
        toast.success(result.message);
        router.push("/admin/shop/books");
      } else {
        console.error(result.error);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update book:", error);
      toast.error("An error occurred while updating the book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!data?.book) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center py-20">
          <p className="text-xl text-red-500">Book not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const book = data.book;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <p className="text-muted-foreground">
          Update the details for &quot;{book.tittle}&quot;
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Note: This updates the base book information. To edit individual
          variants (price, status, images), use the edit button on each variant
          card.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6 bg-white rounded-lg p-6">
        <FieldSet>
          <FieldLegend>Book Details</FieldLegend>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="tittle">Title *</FieldLabel>
              <Input
                id="tittle"
                name="tittle"
                placeholder="Enter book title"
                defaultValue={book.tittle}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="seriesId">Series ID</FieldLabel>
              <Input
                id="seriesId"
                name="seriesId"
                placeholder="Enter series ID (optional)"
                defaultValue={book.seriesId || ""}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="releaseDate">Release Date *</FieldLabel>
              <Input
                id="releaseDate"
                name="releaseDate"
                type="date"
                defaultValue={
                  book.releaseDate
                    ? new Date(book.releaseDate).toISOString().split("T")[0]
                    : ""
                }
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="synopsis">Synopsis *</FieldLabel>
              <Textarea
                id="synopsis"
                name="synopsis"
                placeholder="Enter book synopsis"
                rows={6}
                defaultValue={book.synopsis}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="badge">Badge</FieldLabel>
              <Input
                id="badge"
                name="badge"
                placeholder="e.g., New Release, Bestseller"
                defaultValue={book.badge || ""}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Featured Book Settings</FieldLegend>
          <FieldDescription>
            Mark this book as featured to display it in the featured carousel.
          </FieldDescription>
          <FieldGroup className="space-y-4">
            <Field>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  name="isFeatured"
                  value="true"
                  defaultChecked={book.isFeatured}
                />
                <FieldLabel htmlFor="isFeatured" className="font-normal">
                  Mark as featured book
                </FieldLabel>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="featuredOrder">
                Featured Order (Lower numbers appear first)
              </FieldLabel>
              <Input
                id="featuredOrder"
                name="featuredOrder"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={book.featuredOrder || ""}
              />
              <FieldDescription>
                Set the display order in the featured carousel. Leave empty for
                automatic ordering.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Tags</FieldLegend>
          <FieldDescription>
            Add relevant tags to help categorize your book.
          </FieldDescription>
          <FieldGroup className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Tropes</FieldLegend>
          <FieldDescription>Add story tropes or themes.</FieldDescription>
          <FieldGroup className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add a trope"
                value={currentTrope}
                onChange={(e) => setCurrentTrope(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTrope())
                }
              />
              <Button type="button" onClick={addTrope} variant="outline">
                Add
              </Button>
            </div>
            {tropes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tropes.map((trope) => (
                  <span
                    key={trope}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    {trope}
                    <button
                      type="button"
                      onClick={() => removeTrope(trope)}
                      className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FieldGroup>
        </FieldSet>

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating Book..." : "Update Book"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
