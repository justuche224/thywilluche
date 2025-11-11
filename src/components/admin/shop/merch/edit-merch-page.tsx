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
import { updateBaseMerch, getBaseMerch } from "@/actions/shop/merch/admin-new";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface EditMerchPageProps {
  baseMerchId: string;
}

export function EditMerchPage({ baseMerchId }: EditMerchPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["base-merch", baseMerchId],
    queryFn: () => getBaseMerch(baseMerchId),
  });

  useEffect(() => {
    if (data?.merch) {
      setTags(data.merch.tags || []);
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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    formData.set("id", baseMerchId);
    formData.delete("tags");

    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    try {
      const result = await updateBaseMerch(formData);
      if (result.message) {
        toast.success(result.message);
        router.push("/admin/shop/merch");
      } else {
        console.error(result.error);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update merchandise:", error);
      toast.error("An error occurred while updating the merchandise.");
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

  if (!data?.merch) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center py-20">
          <p className="text-xl text-red-500">Merchandise not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const merch = data.merch;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Merchandise</h1>
        <p className="text-muted-foreground">
          Update the details for &quot;{merch.name}&quot;
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Note: This updates the base merchandise information. To edit
          individual variants (price, status, images), use the edit button on
          each variant card.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6 bg-white rounded-lg p-6">
        <FieldSet>
          <FieldLegend>Product Details</FieldLegend>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Name *</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                defaultValue={merch.name}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description *</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                rows={6}
                defaultValue={merch.description}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="badge">Badge</FieldLabel>
              <Input
                id="badge"
                name="badge"
                placeholder="e.g., New Arrival, Best Seller"
                defaultValue={merch.badge || ""}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Featured Merchandise Settings</FieldLegend>
          <FieldDescription>
            Mark this merchandise as featured to display it in the featured
            carousel.
          </FieldDescription>
          <FieldGroup className="space-y-4">
            <Field>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  name="isFeatured"
                  value="true"
                  defaultChecked={merch.isFeatured}
                />
                <FieldLabel htmlFor="isFeatured" className="font-normal">
                  Mark as featured merchandise
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
                defaultValue={merch.featuredOrder || ""}
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
            Add relevant tags to help categorize your merchandise.
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

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating Merchandise..." : "Update Merchandise"}
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
