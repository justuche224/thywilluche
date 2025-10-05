"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateGhostwritingContent } from "@/actions/admin/services-content";
import { toast } from "sonner";
import Image from "next/image";

interface GhostwritingFormProps {
  data: Record<string, string>;
}

export function GhostwritingForm({ data }: GhostwritingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await updateGhostwritingContent(formData);

      if (result.success) {
        toast.success(result.message);
        window.dispatchEvent(new Event("refreshServicesPreview"));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating ghostwriting content:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={data.title || ""}
              placeholder="Professional Ghostwriting"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={data.description || ""}
              placeholder="Bring your story to life with professional ghostwriting services..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="heroImage">Hero Image</Label>
            <Input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/*"
            />
            {data.heroImage && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Current image:
                </p>
                <Image
                  src={data.heroImage}
                  alt="Ghostwriting hero"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <Input
                  type="hidden"
                  name="existingHeroImage"
                  value={data.heroImage}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to Expect Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatToExpectTitle">Title</Label>
            <Input
              id="whatToExpectTitle"
              name="whatToExpectTitle"
              defaultValue={data.whatToExpectTitle || ""}
              placeholder="What to Expect"
            />
          </div>
          <div>
            <Label htmlFor="whatToExpectSubtitle">Subtitle</Label>
            <Input
              id="whatToExpectSubtitle"
              name="whatToExpectSubtitle"
              defaultValue={data.whatToExpectSubtitle || ""}
              placeholder="Collaborative storytelling that honors your voice and vision"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Collaborative Process
            </Label>
            <div>
              <Label htmlFor="processTitle">Title</Label>
              <Input
                id="processTitle"
                name="processTitle"
                defaultValue={data.processTitle || ""}
                placeholder="Collaborative Process"
              />
            </div>
            <div>
              <Label htmlFor="processDescription">Description</Label>
              <Textarea
                id="processDescription"
                name="processDescription"
                defaultValue={data.processDescription || ""}
                placeholder="We work together throughout the entire process..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Authentic Storytelling
            </Label>
            <div>
              <Label htmlFor="collaborationTitle">Title</Label>
              <Input
                id="collaborationTitle"
                name="collaborationTitle"
                defaultValue={data.collaborationTitle || ""}
                placeholder="Authentic Storytelling"
              />
            </div>
            <div>
              <Label htmlFor="collaborationDescription">Description</Label>
              <Textarea
                id="collaborationDescription"
                name="collaborationDescription"
                defaultValue={data.collaborationDescription || ""}
                placeholder="I specialize in capturing your unique voice..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Professional Quality
            </Label>
            <div>
              <Label htmlFor="qualityTitle">Title</Label>
              <Input
                id="qualityTitle"
                name="qualityTitle"
                defaultValue={data.qualityTitle || ""}
                placeholder="Professional Quality"
              />
            </div>
            <div>
              <Label htmlFor="qualityDescription">Description</Label>
              <Textarea
                id="qualityDescription"
                name="qualityDescription"
                defaultValue={data.qualityDescription || ""}
                placeholder="From manuscript development to final editing..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Complete Confidentiality
            </Label>
            <div>
              <Label htmlFor="confidentialityTitle">Title</Label>
              <Input
                id="confidentialityTitle"
                name="confidentialityTitle"
                defaultValue={data.confidentialityTitle || ""}
                placeholder="Complete Confidentiality"
              />
            </div>
            <div>
              <Label htmlFor="confidentialityDescription">Description</Label>
              <Textarea
                id="confidentialityDescription"
                name="confidentialityDescription"
                defaultValue={data.confidentialityDescription || ""}
                placeholder="Your story is safe with me..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Who This Is For</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whoThisIsForTitle">Title</Label>
            <Input
              id="whoThisIsForTitle"
              name="whoThisIsForTitle"
              defaultValue={data.whoThisIsForTitle || ""}
              placeholder="Who This Is For"
            />
          </div>
          <div>
            <Label htmlFor="whoThisIsForDescription1">Description 1</Label>
            <Textarea
              id="whoThisIsForDescription1"
              name="whoThisIsForDescription1"
              defaultValue={data.whoThisIsForDescription1 || ""}
              placeholder="My ghostwriting services are perfect for individuals..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="whoThisIsForDescription2">Description 2</Label>
            <Textarea
              id="whoThisIsForDescription2"
              name="whoThisIsForDescription2"
              defaultValue={data.whoThisIsForDescription2 || ""}
              placeholder="This service is ideal for memoirs, self-help books..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Ghostwriting Content"}
      </Button>
    </form>
  );
}
