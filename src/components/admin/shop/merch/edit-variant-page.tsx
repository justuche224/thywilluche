"use client";

import { useState, useRef, useEffect } from "react";
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
import {
  updateMerchVariant,
  getMerchVariant,
} from "@/actions/shop/merch/admin-new";
import { useRouter } from "next/navigation";
import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const statuses = [
  "Available",
  "Sold Out",
  "On Hold",
  "Preorder",
  "Coming Soon",
] as const;

interface EditVariantPageProps {
  variantId: string;
}

export function EditVariantPage({ variantId }: EditVariantPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [externalLinks, setExternalLinks] = useState<
    Array<{ title: string; url: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["merch-variant", variantId],
    queryFn: () => getMerchVariant(variantId),
  });

  useEffect(() => {
    if (data?.variant?.imageUrl) {
      setImagePreview(data.variant.imageUrl);
    }
    if (data?.variant?.externalLinks) {
      try {
        const links = JSON.parse(data.variant.externalLinks);
        setExternalLinks(links);
      } catch {
        setExternalLinks([]);
      }
    }
  }, [data]);

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

  const addExternalLink = () => {
    setExternalLinks([...externalLinks, { title: "", url: "" }]);
  };

  const removeExternalLink = (index: number) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  const updateExternalLink = (
    index: number,
    field: "title" | "url",
    value: string
  ) => {
    const updated = [...externalLinks];
    updated[index][field] = value;
    setExternalLinks(updated);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    formData.set("id", variantId);
    formData.set("externalLinks", JSON.stringify(externalLinks));

    try {
      const result = await updateMerchVariant(formData);
      if (result.message) {
        toast.success(result.message);
        router.push("/admin/shop/merch");
      } else {
        console.error(result.error);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update variant:", error);
      toast.error("An error occurred while updating the variant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!data?.variant || !data?.merch) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <p className="text-xl text-red-500">Variant not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const variant = data.variant;
  const merch = data.merch;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Variant</h1>
        <p className="text-muted-foreground">
          Editing {variant.variant} version of &quot;{merch.name}&quot;
        </p>
      </div>

      <form
        action={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="lg:col-span-1">
          <FieldSet>
            <FieldLegend>Variant Image</FieldLegend>
            <FieldDescription>
              Upload a new image or keep the existing one.
            </FieldDescription>
            <div className="mt-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-xs mx-auto aspect-square rounded-lg shadow-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Variant preview"
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
                        Click below to upload an image
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
                />
              </div>
            </div>
          </FieldSet>
        </div>

        <div className="lg:col-span-1 space-y-6 bg-white rounded-lg p-6">
          <FieldSet>
            <FieldLegend>Variant Details</FieldLegend>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel>Variant Type</FieldLabel>
                <Input value={variant.variant} disabled className="bg-muted" />
                <FieldDescription>
                  Variant type cannot be changed. Create a new variant instead.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="status">Status *</FieldLabel>
                <Select name="status" defaultValue={variant.status} required>
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
                    defaultValue={variant.price}
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
                    defaultValue={variant.slashedFrom || ""}
                  />
                </Field>
              </div>

              <Field>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isListed"
                    name="isListed"
                    value="true"
                    defaultChecked={variant.isListed}
                  />
                  <FieldLabel htmlFor="isListed" className="font-normal">
                    Listed for sale
                  </FieldLabel>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>External Purchase Links</FieldLegend>
            <FieldDescription>
              Add links to where customers can purchase this variant.
            </FieldDescription>
            <FieldGroup className="space-y-3">
              {externalLinks.map((link, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <Field className="flex-1">
                    <FieldLabel>Link Title</FieldLabel>
                    <Input
                      placeholder="e.g., Amazon"
                      value={link.title}
                      onChange={(e) =>
                        updateExternalLink(index, "title", e.target.value)
                      }
                    />
                  </Field>
                  <Field className="flex-1">
                    <FieldLabel>URL</FieldLabel>
                    <Input
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) =>
                        updateExternalLink(index, "url", e.target.value)
                      }
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExternalLink(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addExternalLink}
                className="w-full"
              >
                + Add Purchase Link
              </Button>
            </FieldGroup>
          </FieldSet>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating Variant..." : "Update Variant"}
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
