"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateAboutJourneyContent } from "@/actions/admin/about-content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface AboutContentManagerProps {
  initialData: {
    journey: Record<string, string>;
    purpose: Record<string, string>;
    missionVision: Record<string, string>;
  };
}

export default function AboutContentManager({
  initialData,
}: AboutContentManagerProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Journey State
  const [journeyPreviewImage, setJourneyPreviewImage] = useState<string | null>(
    initialData.journey.image || null
  );
  const [journeyTitle, setJourneyTitle] = useState(
    initialData.journey.title || ""
  );
  const [journeyParagraph1, setJourneyParagraph1] = useState(
    initialData.journey.paragraph1 || ""
  );
  const [journeyParagraph2, setJourneyParagraph2] = useState(
    initialData.journey.paragraph2 || ""
  );

  // Purpose State
  const [purposeTitle, setPurposeTitle] = useState(
    initialData.purpose.title || ""
  );
  const [purposeParagraph1, setPurposeParagraph1] = useState(
    initialData.purpose.paragraph1 || ""
  );
  const [purposeParagraph2, setPurposeParagraph2] = useState(
    initialData.purpose.paragraph2 || ""
  );
  const [purposeParagraph3, setPurposeParagraph3] = useState(
    initialData.purpose.paragraph3 || ""
  );

  const handleJourneyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJourneyPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mission & Vision State
  const [missionTitle, setMissionTitle] = useState(
    initialData.missionVision.missionTitle || ""
  );
  const [missionParagraph1, setMissionParagraph1] = useState(
    initialData.missionVision.missionParagraph1 || ""
  );
  const [missionParagraph2, setMissionParagraph2] = useState(
    initialData.missionVision.missionParagraph2 || ""
  );
  const [visionTitle, setVisionTitle] = useState(
    initialData.missionVision.visionTitle || ""
  );
  const [visionParagraph1, setVisionParagraph1] = useState(
    initialData.missionVision.visionParagraph1 || ""
  );
  const [visionParagraph2, setVisionParagraph2] = useState(
    initialData.missionVision.visionParagraph2 || ""
  );

  const handleSaveAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("existingJourneyImage", initialData.journey.image || "");

      const result = await updateAboutJourneyContent(formData);

      if (result.success) {
        toast.success("About content updated successfully!");
        window.dispatchEvent(new CustomEvent("refreshAboutPreview"));
      } else {
        toast.error("Failed to update about content");
      }
    } catch (error) {
      console.error("Error updating about content:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Page Content Manager</h1>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>

      {/* My Journey Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Journey Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="journeyImage">Journey Image</Label>
            {journeyPreviewImage && (
              <div className="mb-4">
                <Image
                  src={journeyPreviewImage}
                  alt="Journey Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <Input
              id="journeyImage"
              name="journeyImage"
              type="file"
              accept="image/*"
              onChange={handleJourneyImageChange}
            />
            <p className="text-sm text-muted-foreground">
              Upload an image for your journey section
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="journeyTitle">Section Title</Label>
            <Input
              id="journeyTitle"
              name="journeyTitle"
              value={journeyTitle}
              onChange={(e) => setJourneyTitle(e.target.value)}
              placeholder="My Journey"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="journeyParagraph1">First Paragraph</Label>
            <Textarea
              id="journeyParagraph1"
              name="journeyParagraph1"
              value={journeyParagraph1}
              onChange={(e) => setJourneyParagraph1(e.target.value)}
              rows={4}
              placeholder="Enter the first paragraph of your journey..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="journeyParagraph2">Second Paragraph</Label>
            <Textarea
              id="journeyParagraph2"
              name="journeyParagraph2"
              value={journeyParagraph2}
              onChange={(e) => setJourneyParagraph2(e.target.value)}
              rows={4}
              placeholder="Enter the second paragraph of your journey..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Purpose Section */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="purposeTitle">Section Title</Label>
            <Input
              id="purposeTitle"
              name="purposeTitle"
              value={purposeTitle}
              onChange={(e) => setPurposeTitle(e.target.value)}
              placeholder="The Purpose Behind This Platform"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purposeParagraph1">First Paragraph</Label>
            <Textarea
              id="purposeParagraph1"
              name="purposeParagraph1"
              value={purposeParagraph1}
              onChange={(e) => setPurposeParagraph1(e.target.value)}
              rows={4}
              placeholder="Enter the first paragraph of your purpose..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purposeParagraph2">Second Paragraph</Label>
            <Textarea
              id="purposeParagraph2"
              name="purposeParagraph2"
              value={purposeParagraph2}
              onChange={(e) => setPurposeParagraph2(e.target.value)}
              rows={4}
              placeholder="Enter the second paragraph of your purpose..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purposeParagraph3">Third Paragraph</Label>
            <Textarea
              id="purposeParagraph3"
              name="purposeParagraph3"
              value={purposeParagraph3}
              onChange={(e) => setPurposeParagraph3(e.target.value)}
              rows={4}
              placeholder="Enter the third paragraph of your purpose..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mission & Vision Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Mission */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-xl font-semibold">Mission</h3>
            <div className="space-y-2">
              <Label htmlFor="missionTitle">Mission Title</Label>
              <Input
                id="missionTitle"
                name="missionTitle"
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="Our Mission"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="missionParagraph1">First Paragraph</Label>
              <Textarea
                id="missionParagraph1"
                name="missionParagraph1"
                value={missionParagraph1}
                onChange={(e) => setMissionParagraph1(e.target.value)}
                rows={4}
                placeholder="Enter the first paragraph of your mission..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="missionParagraph2">Second Paragraph</Label>
              <Textarea
                id="missionParagraph2"
                name="missionParagraph2"
                value={missionParagraph2}
                onChange={(e) => setMissionParagraph2(e.target.value)}
                rows={4}
                placeholder="Enter the second paragraph of your mission..."
              />
            </div>
          </div>

          {/* Vision */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Vision</h3>
            <div className="space-y-2">
              <Label htmlFor="visionTitle">Vision Title</Label>
              <Input
                id="visionTitle"
                name="visionTitle"
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="Our Vision"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visionParagraph1">First Paragraph</Label>
              <Textarea
                id="visionParagraph1"
                name="visionParagraph1"
                value={visionParagraph1}
                onChange={(e) => setVisionParagraph1(e.target.value)}
                rows={4}
                placeholder="Enter the first paragraph of your vision..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visionParagraph2">Second Paragraph</Label>
              <Textarea
                id="visionParagraph2"
                name="visionParagraph2"
                value={visionParagraph2}
                onChange={(e) => setVisionParagraph2(e.target.value)}
                rows={4}
                placeholder="Enter the second paragraph of your vision..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
