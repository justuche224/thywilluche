import Hero from "@/components/home/hero";
import WhoIAm from "@/components/home/who-i-am";
import Featured from "@/components/home/featured";
import Community from "@/components/home/community";
import { getHomeContent } from "@/actions/home-content";

export default async function Home() {
  const content = await getHomeContent();

  const heroData = content.hero || {};
  const whoIAmData = content.whoIAm || {};

  return (
    <>
      <Hero
        title1={heroData.title1}
        title2={heroData.title2}
        title3={heroData.title3}
        tagline1={heroData.tagline1}
        tagline2={heroData.tagline2}
        tagline3={heroData.tagline3}
        description={heroData.description}
        heroImage={heroData.heroImage}
        ctaText={heroData.ctaText}
        ctaLink={heroData.ctaLink}
      />
      <WhoIAm
        title={whoIAmData.title}
        description={whoIAmData.description}
        image={whoIAmData.image}
      />
      <Featured />
      <Community />
    </>
  );
}
