import React from "react";
import About from "@/components/about";
import { getAboutContent } from "@/actions/about-content";

const page = async () => {
  const content = await getAboutContent();

  const journeyData = content.journey || {};
  const missionVisionData = content.missionVision || {};

  return (
    <About
      journeyImage={journeyData.image}
      journeyTitle={journeyData.title}
      journeyParagraph1={journeyData.paragraph1}
      journeyParagraph2={journeyData.paragraph2}
      missionTitle={missionVisionData.missionTitle}
      missionParagraph1={missionVisionData.missionParagraph1}
      missionParagraph2={missionVisionData.missionParagraph2}
      visionTitle={missionVisionData.visionTitle}
      visionParagraph1={missionVisionData.visionParagraph1}
      visionParagraph2={missionVisionData.visionParagraph2}
    />
  );
};

export default page;
