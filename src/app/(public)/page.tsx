import { getHomeContent } from "@/actions/home-content";
import { getSocials } from "@/actions/contact-info";
import { getAboutContent } from "@/actions/about-content";
import HomeContent from "./content";

export default async function Home() {
  const content = await getHomeContent();
  const aboutContent = await getAboutContent();
  const socials = await getSocials();

  const heroData = content.hero || {};
  const whoIAmData = content.whoIAm || {};
  const featuredData = content.featured || {};
  const purposeData = aboutContent.purpose || {};

  return (
    <HomeContent
      heroData={heroData}
      whoIAmData={whoIAmData}
      featuredData={featuredData}
      purposeData={purposeData}
      socials={socials}
    />
  );
}
