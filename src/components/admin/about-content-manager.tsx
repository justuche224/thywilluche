"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { bulkUpdateAboutContent } from "@/actions/about-content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AboutContentManagerProps {
  initialData: {
    journey: Record<string, string>;
    missionVision: Record<string, string>;
  };
}

export default function AboutContentManager({
  initialData,
}: AboutContentManagerProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Journey State
  const [journeyImage, setJourneyImage] = useState(
    initialData.journey.image || ""
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

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      const updates = [
        // Journey Section
        { section: "journey", key: "image", value: journeyImage },
        { section: "journey", key: "title", value: journeyTitle },
        { section: "journey", key: "paragraph1", value: journeyParagraph1 },
        { section: "journey", key: "paragraph2", value: journeyParagraph2 },

        // Mission & Vision Section
        {
          section: "missionVision",
          key: "missionTitle",
          value: missionTitle,
        },
        {
          section: "missionVision",
          key: "missionParagraph1",
          value: missionParagraph1,
        },
        {
          section: "missionVision",
          key: "missionParagraph2",
          value: missionParagraph2,
        },
        { section: "missionVision", key: "visionTitle", value: visionTitle },
        {
          section: "missionVision",
          key: "visionParagraph1",
          value: visionParagraph1,
        },
        {
          section: "missionVision",
          key: "visionParagraph2",
          value: visionParagraph2,
        },
      ];

      const result = await bulkUpdateAboutContent(updates);

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">About Page Content Manager</h1>
        <Button onClick={handleSaveAll} disabled={isLoading}>
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
            <Label htmlFor="journeyImage">Journey Image URL</Label>
            <Input
              id="journeyImage"
              value={journeyImage}
              onChange={(e) => setJourneyImage(e.target.value)}
              placeholder="/images/your-image.jpg"
            />
            <p className="text-sm text-muted-foreground">
              Full path to the journey image
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="journeyTitle">Section Title</Label>
            <Input
              id="journeyTitle"
              value={journeyTitle}
              onChange={(e) => setJourneyTitle(e.target.value)}
              placeholder="My Journey"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="journeyParagraph1">First Paragraph</Label>
            <Textarea
              id="journeyParagraph1"
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
              value={journeyParagraph2}
              onChange={(e) => setJourneyParagraph2(e.target.value)}
              rows={4}
              placeholder="Enter the second paragraph of your journey..."
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
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="Our Mission"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="missionParagraph1">First Paragraph</Label>
              <Textarea
                id="missionParagraph1"
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
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="Our Vision"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visionParagraph1">First Paragraph</Label>
              <Textarea
                id="visionParagraph1"
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
                value={visionParagraph2}
                onChange={(e) => setVisionParagraph2(e.target.value)}
                rows={4}
                placeholder="Enter the second paragraph of your vision..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={isLoading}>
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
    </div>
  );
}
