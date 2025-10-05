"use client";

import { ServicesLivePreview } from "./services-live-preview";
import { CoachingLivePreview } from "./coaching-live-preview";
import { GhostwritingLivePreview } from "./ghostwriting-live-preview";
import { ConsultingLivePreview } from "./consulting-live-preview";

interface ServicesDynamicPreviewProps {
  activeTab: string;
  initialOverviewData: Record<string, string>;
  initialCoachingData: Record<string, string>;
  initialGhostwritingData: Record<string, string>;
  initialConsultingData: Record<string, string>;
}

export function ServicesDynamicPreview({
  activeTab,
  initialOverviewData,
  initialCoachingData,
  initialGhostwritingData,
  initialConsultingData,
}: ServicesDynamicPreviewProps) {
  switch (activeTab) {
    case "overview":
      return <ServicesLivePreview initialOverviewData={initialOverviewData} />;
    case "coaching":
      return <CoachingLivePreview initialCoachingData={initialCoachingData} />;
    case "ghostwriting":
      return (
        <GhostwritingLivePreview
          initialGhostwritingData={initialGhostwritingData}
        />
      );
    case "consulting":
      return (
        <ConsultingLivePreview initialConsultingData={initialConsultingData} />
      );
    default:
      return <ServicesLivePreview initialOverviewData={initialOverviewData} />;
  }
}
