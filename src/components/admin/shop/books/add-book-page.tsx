"use client";

import { useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addBookWithVariant } from "@/actions/shop/books/admin-new";
import { useRouter } from "next/navigation";
import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const variants = [
  "Hardcover",
  "Softcover",
  "E-Book",
  "Audiobook",
  "Signed",
] as const;

const statuses = [
  "Available",
  "Sold Out",
  "On Hold",
  "Preorder",
  "Coming Soon",
] as const;

// TODO: Add series select

export function AddBookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tropes, setTropes] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentTrope, setCurrentTrope] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

    // Clear existing tags and trope entries
    formData.delete("tags");
    formData.delete("trope");

    // Add tags as individual entries
    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    // Add tropes as individual entries
    tropes.forEach((trope) => {
      formData.append("trope", trope);
    });

    try {
      const result = await addBookWithVariant(formData);
      if (result.message) {
        toast.success(result.message);
        router.push("/admin/shop/books");
      } else {
        console.error(result.error);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to add book:", error);
      toast.error("An error occurred while adding the book.");  
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Book</h1>
        <p className="text-muted-foreground">
          Fill in the details to add a new book to your catalog.
        </p>
      </div>

      <form
        action={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column - Image Display */}
        <div className="lg:col-span-1">
          <FieldSet>
            <FieldLegend>Book Cover</FieldLegend>
            <FieldDescription>
              Upload a high-quality image of the book cover.
            </FieldDescription>
            <div className="mt-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-xs mx-auto aspect-[3/4] rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Book cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">No image selected</p>
                      <p className="text-muted-foreground">
                        Click below to upload a book cover
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </div>
            </div>
          </FieldSet>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-1 space-y-6 bg-white rounded-lg p-6">
          <FieldSet>
            <FieldLegend>Book Details</FieldLegend>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="tittle">Title *</FieldLabel>
                <Input
                  id="tittle"
                  name="tittle"
                  placeholder="Enter book title"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="seriesId">Series ID</FieldLabel>
                <Input
                  id="seriesId"
                  name="seriesId"
                  placeholder="Enter series ID (optional)"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="releaseDate">Release Date *</FieldLabel>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="synopsis">Synopsis *</FieldLabel>
                <Textarea
                  id="synopsis"
                  name="synopsis"
                  placeholder="Enter book synopsis"
                  rows={4}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="variant">Variant *</FieldLabel>
                  <Select name="variant" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {variant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Status *</FieldLabel>
                  <Select name="status" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="price">Price ($) *</FieldLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="slashedFrom">
                    Slashed From ($)
                  </FieldLabel>
                  <Input
                    id="slashedFrom"
                    name="slashedFrom"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="badge">Badge</FieldLabel>
                <Input
                  id="badge"
                  name="badge"
                  placeholder="e.g., New Release, Bestseller"
                />
              </Field>

              <Field>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isListed"
                    name="isListed"
                    value="true"
                    defaultChecked
                  />
                  <FieldLabel htmlFor="isListed" className="font-normal">
                    Listed for sale
                  </FieldLabel>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Tags Section */}
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

          {/* Tropes Section */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting} className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Adding Book..." : "Add Book"}
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
        </div>
      </form>
    </div>
  );
}
