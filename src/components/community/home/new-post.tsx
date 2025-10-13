"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ImagePlus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPost, getActiveGroups } from "@/actions/community/posts";
import { useQuery } from "@tanstack/react-query";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const NewPost = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string>("general");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["community-groups"],
    queryFn: async () => {
      const result = await getActiveGroups();
      return result;
    },
  });

  const validateImages = (files: File[]): string | null => {
    if (files.length > MAX_IMAGES) {
      return `Maximum ${MAX_IMAGES} images allowed`;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return `File "${file.name}" is not an image`;
      }
      if (file.size > MAX_FILE_SIZE) {
        return `File "${file.name}" is too large. Maximum size is 5MB`;
      }
    }

    return null;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = selectedImages.length + files.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const error = validateImages(files);
    if (error) {
      toast.error(error);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter some content for your post");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        selectedImages.forEach((image) => {
          formData.append("images", image);
        });
        formData.append("path", "community/posts");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Failed to upload images");
        }

        imageUrls = uploadResult.imageUrls;
        setIsUploading(false);
      }

      const result = await createPost({
        content,
        excerpt: content.substring(0, 200),
        images: imageUrls,
        groupId: groupId === "general" ? undefined : groupId,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      router.push("/community/home");
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/community/home">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Group (Optional)
            </label>
            <Select
              value={groupId || "general"}
              onValueChange={setGroupId}
              disabled={isLoadingGroups}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingGroups ? "Loading groups..." : "Select a group"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Forum</SelectItem>
                {groupsData?.success &&
                  groupsData.data.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={8}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Images (Optional - Max {MAX_IMAGES}, 5MB each)
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {selectedImages.length < MAX_IMAGES && (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                <ImagePlus className="w-5 h-5" />
                <span className="text-sm">
                  Add Images ({selectedImages.length}/{MAX_IMAGES})
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your post will be submitted for admin
              approval before being published.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading Images...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Post...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
