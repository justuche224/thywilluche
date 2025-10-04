import Hero from "@/components/home/hero";
import WhoIAm from "@/components/home/who-i-am";
import Featured from "@/components/home/featured";
import Community from "@/components/home/community";
import { getHomeContent } from "@/actions/home-content";
import { getSocials } from "@/actions/contact-info";

export default async function Home() {
  const content = await getHomeContent();
  const socials = await getSocials();

  const heroData = content.hero || {};
  const whoIAmData = content.whoIAm || {};
  const featuredData = content.featured || {};

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
        socials={socials}
      />
      <WhoIAm
        title={whoIAmData.title}
        description={whoIAmData.description}
        image={whoIAmData.image}
      />
      <Featured
        title={featuredData.title}
        quote={featuredData.quote}
        description={featuredData.description}
        image1={featuredData.image1}
        image2={featuredData.image2}
      />
      <Community />
    </>
  );
}
