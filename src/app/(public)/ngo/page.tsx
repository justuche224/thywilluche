import React from "react";
import NGO from "@/components/ngo";
import Head from "next/head";
import { Metadata } from "next";
import { getNgoContent } from "@/actions/ngo-content";

export const metadata: Metadata = {
  title: "Thywill Fountain of Hope",
  description:
    "We are dedicated to empowering communities through education, healthcare, and sustainable development initiatives. Our mission is to create lasting positive change by addressing the root causes of poverty and inequality.",
  icons: {
    icon: "/logos/NGO.png",
  },
};

const page = async () => {
  const content = await getNgoContent();

  const heroData = content.hero || {};
  const missionData = content.mission || {};
  const visionData = content.vision || {};
  const programsData = content.programs || {};
  const educationData = content.education || {};
  const healthcareData = content.healthcare || {};
  const developmentData = content.development || {};
  const impactData = content.impact || {};
  const ctaData = content.cta || {};

  return (
    <>
      <Head>
        <title>Thywill Fountain of Hope</title>
        <link rel="icon" href="/logos/NGO.png" sizes="any" />
      </Head>
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
    </>
  );
};

export default page;
