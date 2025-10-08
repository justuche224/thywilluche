"use client";

import Hero from "@/components/home/hero";
import WhoIAm from "@/components/home/who-i-am";
import Featured from "@/components/home/featured";
import Purpose from "@/components/home/purpose";
import React, { useState } from "react";
import Community from "@/components/home/community";
import Welcome from "@/components/home/welcome";

const HomeContent = ({
  heroData,
  whoIAmData,
  featuredData,
  purposeData,
  socials,
}: {
  heroData: Record<string, string>;
  whoIAmData: Record<string, string>;
  featuredData: Record<string, string>;
  purposeData: Record<string, string>;
  socials: {
    key: string;
    label: string;
    url: string;
  }[];
}) => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome ? (
        <Welcome socials={socials} setShowWelcome={setShowWelcome} />
      ) : (
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
          <Purpose
            title={purposeData.title}
            paragraph1={purposeData.paragraph1}
            paragraph2={purposeData.paragraph2}
            paragraph3={purposeData.paragraph3}
          />
          <Community />
        </>
      )}
    </>
  );
};

export default HomeContent;
