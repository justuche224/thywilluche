"use client";

import { updateWhoIAmContent } from "@/actions/admin/home-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface WhoIAmFormProps {
  data: Record<string, string>;
}

export function WhoIAmForm({ data }: WhoIAmFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    data.image || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await updateWhoIAmContent(formData);

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
          defaultValue={data.title || "Who I Am"}
          placeholder="Who I Am"
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

      <div className="space-y-2">
        <Label htmlFor="image">Section Image</Label>
        {previewImage && (
          <div className="mb-4">
            <Image
              src={previewImage}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input type="hidden" name="existingImage" value={data.image || ""} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Who I Am Section"}
      </Button>
    </form>
  );
}
