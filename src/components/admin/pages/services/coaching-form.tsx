"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCoachingContent } from "@/actions/admin/services-content";
import Image from "next/image";
import { toast } from "sonner";

interface CoachingFormProps {
  data: Record<string, string>;
}

export function CoachingForm({ data }: CoachingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await updateCoachingContent(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating coaching content:", error);
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
              placeholder="Personal Coaching"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={data.description || ""}
              placeholder="Experience transformative one-on-one coaching..."
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
                  alt="Coaching hero"
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
              placeholder="Personalized support tailored to your unique journey"
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
              Personalized Strategy
            </Label>
            <div>
              <Label htmlFor="strategyTitle">Title</Label>
              <Input
                id="strategyTitle"
                name="strategyTitle"
                defaultValue={data.strategyTitle || ""}
                placeholder="Personalized Strategy"
              />
            </div>
            <div>
              <Label htmlFor="strategyDescription">Description</Label>
              <Textarea
                id="strategyDescription"
                name="strategyDescription"
                defaultValue={data.strategyDescription || ""}
                placeholder="Every session is tailored..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Practical Tools</Label>
            <div>
              <Label htmlFor="toolsTitle">Title</Label>
              <Input
                id="toolsTitle"
                name="toolsTitle"
                defaultValue={data.toolsTitle || ""}
                placeholder="Practical Tools"
              />
            </div>
            <div>
              <Label htmlFor="toolsDescription">Description</Label>
              <Textarea
                id="toolsDescription"
                name="toolsDescription"
                defaultValue={data.toolsDescription || ""}
                placeholder="Leave each session with actionable strategies..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Accountability & Support
            </Label>
            <div>
              <Label htmlFor="accountabilityTitle">Title</Label>
              <Input
                id="accountabilityTitle"
                name="accountabilityTitle"
                defaultValue={data.accountabilityTitle || ""}
                placeholder="Accountability & Support"
              />
            </div>
            <div>
              <Label htmlFor="accountabilityDescription">Description</Label>
              <Textarea
                id="accountabilityDescription"
                name="accountabilityDescription"
                defaultValue={data.accountabilityDescription || ""}
                placeholder="Regular check-ins and ongoing support..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Safe Space</Label>
            <div>
              <Label htmlFor="safeSpaceTitle">Title</Label>
              <Input
                id="safeSpaceTitle"
                name="safeSpaceTitle"
                defaultValue={data.safeSpaceTitle || ""}
                placeholder="Safe Space"
              />
            </div>
            <div>
              <Label htmlFor="safeSpaceDescription">Description</Label>
              <Textarea
                id="safeSpaceDescription"
                name="safeSpaceDescription"
                defaultValue={data.safeSpaceDescription || ""}
                placeholder="A judgment-free environment..."
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
              placeholder="My coaching services are designed for individuals..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="whoThisIsForDescription2">Description 2</Label>
            <Textarea
              id="whoThisIsForDescription2"
              name="whoThisIsForDescription2"
              defaultValue={data.whoThisIsForDescription2 || ""}
              placeholder="This is for you if you're navigating life transitions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Coaching Content"}
      </Button>
    </form>
  );
}
