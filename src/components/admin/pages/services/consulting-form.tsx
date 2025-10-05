"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateConsultingContent } from "@/actions/admin/services-content";
import { toast } from "sonner";
import Image from "next/image";

interface ConsultingFormProps {
  data: Record<string, string>;
}

export function ConsultingForm({ data }: ConsultingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await updateConsultingContent(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating consulting content:", error);
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
              placeholder="Strategic Consulting"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={data.description || ""}
              placeholder="Strategic consulting for organizations..."
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
                  alt="Consulting hero"
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
              placeholder="Strategic guidance that creates real impact and authentic connections"
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
            <Label className="text-lg font-semibold">Strategic Planning</Label>
            <div>
              <Label htmlFor="strategyTitle">Title</Label>
              <Input
                id="strategyTitle"
                name="strategyTitle"
                defaultValue={data.strategyTitle || ""}
                placeholder="Strategic Planning"
              />
            </div>
            <div>
              <Label htmlFor="strategyDescription">Description</Label>
              <Textarea
                id="strategyDescription"
                name="strategyDescription"
                defaultValue={data.strategyDescription || ""}
                placeholder="Comprehensive analysis and strategic planning..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Implementation Support
            </Label>
            <div>
              <Label htmlFor="implementationTitle">Title</Label>
              <Input
                id="implementationTitle"
                name="implementationTitle"
                defaultValue={data.implementationTitle || ""}
                placeholder="Implementation Support"
              />
            </div>
            <div>
              <Label htmlFor="implementationDescription">Description</Label>
              <Textarea
                id="implementationDescription"
                name="implementationDescription"
                defaultValue={data.implementationDescription || ""}
                placeholder="Hands-on support throughout the implementation process..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Ongoing Support</Label>
            <div>
              <Label htmlFor="supportTitle">Title</Label>
              <Input
                id="supportTitle"
                name="supportTitle"
                defaultValue={data.supportTitle || ""}
                placeholder="Ongoing Support"
              />
            </div>
            <div>
              <Label htmlFor="supportDescription">Description</Label>
              <Textarea
                id="supportDescription"
                name="supportDescription"
                defaultValue={data.supportDescription || ""}
                placeholder="Continued guidance and support as your initiatives grow..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Measurable Results</Label>
            <div>
              <Label htmlFor="resultsTitle">Title</Label>
              <Input
                id="resultsTitle"
                name="resultsTitle"
                defaultValue={data.resultsTitle || ""}
                placeholder="Measurable Results"
              />
            </div>
            <div>
              <Label htmlFor="resultsDescription">Description</Label>
              <Textarea
                id="resultsDescription"
                name="resultsDescription"
                defaultValue={data.resultsDescription || ""}
                placeholder="Focus on creating initiatives that deliver measurable impact..."
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
              placeholder="My consulting services are designed for organizations..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="whoThisIsForDescription2">Description 2</Label>
            <Textarea
              id="whoThisIsForDescription2"
              name="whoThisIsForDescription2"
              defaultValue={data.whoThisIsForDescription2 || ""}
              placeholder="This service is perfect for nonprofits, educational institutions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Consulting Content"}
      </Button>
    </form>
  );
}
