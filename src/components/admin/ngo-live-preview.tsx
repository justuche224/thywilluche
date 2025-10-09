"use client";

import NGO from "@/components/ngo";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface NgoLivePreviewProps {
  initialHeroData: Record<string, string>;
  initialMissionData: Record<string, string>;
  initialVisionData: Record<string, string>;
  initialProgramsData: Record<string, string>;
  initialEducationData: Record<string, string>;
  initialHealthcareData: Record<string, string>;
  initialDevelopmentData: Record<string, string>;
  initialImpactData: Record<string, string>;
  initialCtaData: Record<string, string>;
}

export function NgoLivePreview({
  initialHeroData,
  initialMissionData,
  initialVisionData,
  initialProgramsData,
  initialEducationData,
  initialHealthcareData,
  initialDevelopmentData,
  initialImpactData,
  initialCtaData,
}: NgoLivePreviewProps) {
  const [heroData, setHeroData] = useState(initialHeroData);
  const [missionData, setMissionData] = useState(initialMissionData);
  const [visionData, setVisionData] = useState(initialVisionData);
  const [programsData, setProgramsData] = useState(initialProgramsData);
  const [educationData, setEducationData] = useState(initialEducationData);
  const [healthcareData, setHealthcareData] = useState(initialHealthcareData);
  const [developmentData, setDevelopmentData] = useState(
    initialDevelopmentData
  );
  const [impactData, setImpactData] = useState(initialImpactData);
  const [ctaData, setCtaData] = useState(initialCtaData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/ngo-preview");
      const data = await response.json();

      setHeroData(data.hero || {});
      setMissionData(data.mission || {});
      setVisionData(data.vision || {});
      setProgramsData(data.programs || {});
      setEducationData(data.education || {});
      setHealthcareData(data.healthcare || {});
      setDevelopmentData(data.development || {});
      setImpactData(data.impact || {});
      setCtaData(data.cta || {});
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

    window.addEventListener("refreshNgoPreview", handleRefresh);

    return () => {
      window.removeEventListener("refreshNgoPreview", handleRefresh);
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
          <NGO
            heroTitle={heroData.title}
            heroSubtitle={heroData.subtitle}
            heroDescription={heroData.description}
            heroButton1Text={heroData.button1Text}
            heroButton2Text={heroData.button2Text}
            heroImage={heroData.image}
            missionTitle={missionData.title}
            missionDescription1={missionData.description1}
            missionDescription2={missionData.description2}
            missionImage={missionData.image}
            visionTitle={visionData.title}
            visionDescription1={visionData.description1}
            visionDescription2={visionData.description2}
            visionImage={visionData.image}
            programsTitle={programsData.title}
            programsSubtitle={programsData.subtitle}
            educationTitle={educationData.title}
            educationDescription={educationData.description}
            educationImage={educationData.image}
            healthcareTitle={healthcareData.title}
            healthcareDescription={healthcareData.description}
            healthcareImage={healthcareData.image}
            developmentTitle={developmentData.title}
            developmentDescription={developmentData.description}
            developmentImage={developmentData.image}
            impactTitle={impactData.title}
            impactSubtitle={impactData.subtitle}
            livesImpacted={impactData.livesImpacted}
            communitiesServed={impactData.communitiesServed}
            partnerOrganizations={impactData.partnerOrganizations}
            yearsOfService={impactData.yearsOfService}
            successStoriesTitle={impactData.successStoriesTitle}
            successStory1={impactData.successStory1}
            successStory1Author={impactData.successStory1Author}
            successStory2={impactData.successStory2}
            successStory2Author={impactData.successStory2Author}
            impactImage={impactData.image}
            ctaTitle={ctaData.title}
            ctaDescription={ctaData.description}
            ctaButton1Text={ctaData.button1Text}
            ctaButton2Text={ctaData.button2Text}
            ctaButton3Text={ctaData.button3Text}
          />
        </div>
      </div>
    </div>
  );
}
