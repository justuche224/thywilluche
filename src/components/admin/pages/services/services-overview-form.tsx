"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateServicesOverviewContent } from "@/actions/admin/services-content";
import { toast } from "sonner";
import Image from "next/image";

interface ServicesOverviewFormProps {
  data: Record<string, string>;
}

export function ServicesOverviewForm({ data }: ServicesOverviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await updateServicesOverviewContent(formData);

      if (result.success) {
        toast.success(result.message);
        window.dispatchEvent(new Event("refreshServicesPreview"));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating services overview content:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={data.title || ""}
              placeholder="Services"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              name="subtitle"
              defaultValue={data.subtitle || ""}
              placeholder="Transform your vision into reality..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coaching Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coachingTitle">Title</Label>
            <Input
              id="coachingTitle"
              name="coachingTitle"
              defaultValue={data.coachingTitle || ""}
              placeholder="Coaching"
            />
          </div>
          <div>
            <Label htmlFor="coachingDescription">Description</Label>
            <Textarea
              id="coachingDescription"
              name="coachingDescription"
              defaultValue={data.coachingDescription || ""}
              placeholder="One-on-one personalized coaching..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="coachingImage">Image</Label>
            <Input
              id="coachingImage"
              name="coachingImage"
              type="file"
              accept="image/*"
            />
            {data.coachingImage && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Current image:
                </p>
                <Image
                  src={data.coachingImage}
                  alt="Coaching service"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <Input
                  type="hidden"
                  name="existingCoachingImage"
                  value={data.coachingImage}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ghostwriting Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ghostwritingTitle">Title</Label>
            <Input
              id="ghostwritingTitle"
              name="ghostwritingTitle"
              defaultValue={data.ghostwritingTitle || ""}
              placeholder="Ghostwriting"
            />
          </div>
          <div>
            <Label htmlFor="ghostwritingDescription">Description</Label>
            <Textarea
              id="ghostwritingDescription"
              name="ghostwritingDescription"
              defaultValue={data.ghostwritingDescription || ""}
              placeholder="Bring your story to life..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="ghostwritingImage">Image</Label>
            <Input
              id="ghostwritingImage"
              name="ghostwritingImage"
              type="file"
              accept="image/*"
            />
            {data.ghostwritingImage && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Current image:
                </p>
                <Image
                  src={data.ghostwritingImage}
                  alt="Ghostwriting service"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <Input
                  type="hidden"
                  name="existingGhostwritingImage"
                  value={data.ghostwritingImage}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consulting Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="consultingTitle">Title</Label>
            <Input
              id="consultingTitle"
              name="consultingTitle"
              defaultValue={data.consultingTitle || ""}
              placeholder="Consulting"
            />
          </div>
          <div>
            <Label htmlFor="consultingDescription">Description</Label>
            <Textarea
              id="consultingDescription"
              name="consultingDescription"
              defaultValue={data.consultingDescription || ""}
              placeholder="Strategic consulting for organizations..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="consultingImage">Image</Label>
            <Input
              id="consultingImage"
              name="consultingImage"
              type="file"
              accept="image/*"
            />
            {data.consultingImage && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Current image:
                </p>
                <Image
                  src={data.consultingImage}
                  alt="Consulting service"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <Input
                  type="hidden"
                  name="existingConsultingImage"
                  value={data.consultingImage}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ctaTitle">Title</Label>
            <Input
              id="ctaTitle"
              name="ctaTitle"
              defaultValue={data.ctaTitle || ""}
              placeholder="Ready to Get Started?"
            />
          </div>
          <div>
            <Label htmlFor="ctaDescription">Description</Label>
            <Textarea
              id="ctaDescription"
              name="ctaDescription"
              defaultValue={data.ctaDescription || ""}
              placeholder="Whether you're looking for personal coaching..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="ctaButtonText">Button Text</Label>
            <Input
              id="ctaButtonText"
              name="ctaButtonText"
              defaultValue={data.ctaButtonText || ""}
              placeholder="Book a Consultation"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Services Overview"}
      </Button>
    </form>
  );
}
