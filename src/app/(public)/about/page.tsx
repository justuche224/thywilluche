import About from "@/components/about";
import { getAboutContent } from "@/actions/about-content";
import { getMediaHighlights } from "@/actions/media-highlights";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();
  const whoIAmData = content.whoIAm || {};
  const purposeData = content.purpose || {};

  const title = "About | Thywill Uche";
  const description =
    whoIAmData.paragraph1 ||
    purposeData.paragraph1 ||
    "Learn about Thywill Uche - writer, poet, founder, ghostwriter, and life coach. Discover the journey, mission, and vision behind Days I Do Not Die.";

  const whoIAmImage = whoIAmData.image
    ? whoIAmData.image.startsWith("http")
      ? whoIAmData.image
      : `https://thywilluche.com${whoIAmData.image}`
    : "https://thywilluche.com/images/main.jpg";

  return {
    title,
    description,
    keywords: [
      "Thywill Uche",
      "about Thywill Uche",
      "author biography",
      "writer",
      "poet",
      "life coach",
      "ghostwriter",
      "Days I Do Not Die",
      "author story",
      "personal journey",
      "mission",
      "vision",
    ],
    authors: [{ name: "Thywill Uche", url: "https://thywilluche.com" }],
    openGraph: {
      title,
      description,
      url: "https://thywilluche.com/about",
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "profile",
      images: [
        {
          url: whoIAmImage,
          width: 1200,
          height: 630,
          alt: "Thywill Uche",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [whoIAmImage],
      creator: "@thywilluche",
    },
    alternates: {
      canonical: "https://thywilluche.com/about",
    },
  };
}

const page = async () => {
  const content = await getAboutContent();
  const mediaHighlightsResult = await getMediaHighlights();

  const whoIAmData = content.whoIAm || {};
  const journeyData = content.journey || {};
  const purposeData = content.purpose || {};
  const missionVisionData = content.missionVision || {};
  const mediaHighlights = mediaHighlightsResult.success
    ? mediaHighlightsResult.data
    : [];

  return (
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
      mediaHighlights={mediaHighlights}
    />
  );
};

export default page;
