"use client";

import About from "@/components/about";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AboutLivePreviewProps {
  initialWhoIAmData: Record<string, string>;
  initialJourneyData: Record<string, string>;
  initialPurposeData: Record<string, string>;
  initialMissionVisionData: Record<string, string>;
}

export function AboutLivePreview({
  initialWhoIAmData,
  initialJourneyData,
  initialPurposeData,
  initialMissionVisionData,
}: AboutLivePreviewProps) {
  const [whoIAmData, setWhoIAmData] = useState(initialWhoIAmData);
  const [journeyData, setJourneyData] = useState(initialJourneyData);
  const [purposeData, setPurposeData] = useState(initialPurposeData);
  const [missionVisionData, setMissionVisionData] = useState(
    initialMissionVisionData
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/about-preview");
      const data = await response.json();

      setWhoIAmData(data.whoIAm || {});
      setJourneyData(data.journey || {});
      setPurposeData(data.purpose || {});
      setMissionVisionData(data.missionVision || {});
    } catch (error) {
      console.error("Failed to refresh preview:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const handleRefresh = () => {
      refreshPreview();
    };

    window.addEventListener("refreshAboutPreview", handleRefresh);

    return () => {
      window.removeEventListener("refreshAboutPreview", handleRefresh);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <Button
          onClick={refreshPreview}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="scale-50 origin-top-left w-[200%]">
          <About
            whoIAmImage={whoIAmData.image}
            whoIAmTitle={whoIAmData.title}
            whoIAmParagraph1={whoIAmData.paragraph1}
            whoIAmParagraph2={whoIAmData.paragraph2}
            whoIAmParagraph3={whoIAmData.paragraph3}
            whoIAmParagraph4={whoIAmData.paragraph4}
            journeyImage={journeyData.image}
            journeyTitle={journeyData.title}
            journeyParagraph1={journeyData.paragraph1}
            journeyParagraph2={journeyData.paragraph2}
            purposeTitle={purposeData.title}
            purposeParagraph1={purposeData.paragraph1}
            purposeParagraph2={purposeData.paragraph2}
            purposeParagraph3={purposeData.paragraph3}
            missionTitle={missionVisionData.missionTitle}
            missionParagraph1={missionVisionData.missionParagraph1}
            missionParagraph2={missionVisionData.missionParagraph2}
            visionTitle={missionVisionData.visionTitle}
            visionParagraph1={missionVisionData.visionParagraph1}
            visionParagraph2={missionVisionData.visionParagraph2}
          />
        </div>
      </div>
    </div>
  );
}
