"use client";

import { updateFeaturedContent } from "@/actions/admin/home-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface FeaturedFormProps {
  data: Record<string, string>;
}

export function FeaturedForm({ data }: FeaturedFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage1, setPreviewImage1] = useState<string | null>(
    data.image1 || null
  );
  const [previewImage2, setPreviewImage2] = useState<string | null>(
    data.image2 || null
  );

  const handleImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage1(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage2(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await updateFeaturedContent(formData);

    if (result.success) {
      toast.success(result.message);
      window.dispatchEvent(new Event("refreshPreview"));
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={data.title || "Latest Addition"}
          placeholder="Latest Addition"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote/Tagline</Label>
        <Textarea
          id="quote"
          name="quote"
          rows={3}
          defaultValue={data.quote}
          placeholder="Enter a compelling quote or tagline"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={data.description}
          placeholder="Enter description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image1">Image 1 (Left Top)</Label>
          {previewImage1 && (
            <div className="mb-4">
              <Image
                src={previewImage1}
                alt="Preview 1"
                width={200}
                height={250}
                className="rounded-lg object-cover aspect-[3/4]"
              />
            </div>
          )}
          <Input
            id="image1"
            name="image1"
            type="file"
            accept="image/*"
            onChange={handleImage1Change}
          />
          <input
            type="hidden"
            name="existingImage1"
            value={data.image1 || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image2">Image 2 (Right Top)</Label>
          {previewImage2 && (
            <div className="mb-4">
              <Image
                src={previewImage2}
                alt="Preview 2"
                width={200}
                height={250}
                className="rounded-lg object-cover aspect-[3/4]"
              />
            </div>
          )}
          <Input
            id="image2"
            name="image2"
            type="file"
            accept="image/*"
            onChange={handleImage2Change}
          />
          <input
            type="hidden"
            name="existingImage2"
            value={data.image2 || ""}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Featured Section"}
      </Button>
    </form>
  );
}
