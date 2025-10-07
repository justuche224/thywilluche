import React from "react";
import About from "@/components/about";
import { getAboutContent } from "@/actions/about-content";
import { getMediaHighlights } from "@/actions/media-highlights";

const page = async () => {
  const content = await getAboutContent();
  const mediaHighlightsResult = await getMediaHighlights();

  const journeyData = content.journey || {};
  const purposeData = content.purpose || {};
  const missionVisionData = content.missionVision || {};
  const mediaHighlights = mediaHighlightsResult.success
    ? mediaHighlightsResult.data
    : [];

  return (
    <About
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
      mediaHighlights={mediaHighlights}
    />
  );
};

export default page;
