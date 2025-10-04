"use client";

import { updateHeroContent } from "@/actions/admin/home-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface HeroFormProps {
  data: Record<string, string>;
}

export function HeroForm({ data }: HeroFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    data.heroImage || null
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

    const result = await updateHeroContent(formData);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title1">Title Line 1</Label>
          <Input
            id="title1"
            name="title1"
            defaultValue={data.title1 || "365 TIPS,"}
            placeholder="365 TIPS,"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title2">Title Line 2</Label>
          <Input
            id="title2"
            name="title2"
            defaultValue={data.title2 || "365 WINS,"}
            placeholder="365 WINS,"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title3">Title Line 3</Label>
          <Input
            id="title3"
            name="title3"
            defaultValue={data.title3 || "EVERY DAY IS VICTORY"}
            placeholder="EVERY DAY IS VICTORY"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tagline1">Tagline Line 1</Label>
          <Input
            id="tagline1"
            name="tagline1"
            defaultValue={data.tagline1 || "Connecting hearts."}
            placeholder="Connecting hearts."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline2">Tagline Line 2</Label>
          <Input
            id="tagline2"
            name="tagline2"
            defaultValue={data.tagline2 || "Uplifting minds."}
            placeholder="Uplifting minds."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline3">Tagline Line 3</Label>
          <Input
            id="tagline3"
            name="tagline3"
            defaultValue={data.tagline3 || "Living one day at a time."}
            placeholder="Living one day at a time."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={data.description}
          placeholder="Enter hero description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ctaText">CTA Button Text</Label>
          <Input
            id="ctaText"
            name="ctaText"
            defaultValue={data.ctaText || "Explore Works"}
            placeholder="Explore Works"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaLink">CTA Button Link</Label>
          <Input
            id="ctaLink"
            name="ctaLink"
            defaultValue={data.ctaLink || "#"}
            placeholder="#"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroImage">Hero Image</Label>
        {previewImage && (
          <div className="mb-4">
            <Image
              src={previewImage}
              alt="Preview"
              width={200}
              height={250}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <Input
          id="heroImage"
          name="heroImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="hidden"
          name="existingHeroImage"
          value={data.heroImage || ""}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Hero Section"}
      </Button>
    </form>
  );
}
