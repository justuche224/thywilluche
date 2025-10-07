"use client";

import React from "react";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { motion } from "framer-motion";
import Community from "../home/community";
import MediaGallery from "./media-gallery";
import { MediaHighlight } from "@/db/schema/media-highlights";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface AboutProps {
  whoIAmImage?: string;
  whoIAmTitle?: string;
  whoIAmParagraph1?: string;
  whoIAmParagraph2?: string;
  whoIAmParagraph3?: string;
  whoIAmParagraph4?: string;
  journeyImage?: string;
  journeyTitle?: string;
  journeyParagraph1?: string;
  journeyParagraph2?: string;
  purposeTitle?: string;
  purposeParagraph1?: string;
  purposeParagraph2?: string;
  purposeParagraph3?: string;
  missionTitle?: string;
  missionParagraph1?: string;
  missionParagraph2?: string;
  visionTitle?: string;
  visionParagraph1?: string;
  visionParagraph2?: string;
  mediaHighlights?: MediaHighlight[];
}

const About = ({
  whoIAmImage = "/images/IMG_20240828_162619[1].jpg",
  whoIAmTitle = "Who I Am",
  whoIAmParagraph1 = "I am Thywill Uche — a writer, poet, founder, ghostwriter, and life coach.",
  whoIAmParagraph2 = "A voice of resilience and transformation, devoted to helping others find strength in their stories.",
  whoIAmParagraph3 = "I stand at the intersection of art and healing — using words to mend hearts, awaken purpose, and empower individuals to rise beyond their pain and struggle.",
  whoIAmParagraph4 = "My life and my book, Days I Do Not Die, embody survival, spiritual strength, and rebirth. I am more than an author — I am a movement. A living testament that healing is possible, that creativity is sacred, and that authenticity is power. Through my work, I guide others to evolve through their struggles — not by concealing their scars, but by transforming them into stories that inspire hope, courage, and the will to keep rising. I remind the world that every day we live is another day we do not die.",
  journeyImage = "/images/IMG_20240828_162619[1].jpg",
  journeyTitle = "My Journey",
  journeyParagraph1 = "From the depths of personal struggle to becoming a beacon of hope for thousands, my journey has been one of transformation, resilience, and unwavering commitment to living authentically.",
  journeyParagraph2 = "Growing up, I faced challenges that tested my spirit and questioned my path. Mental health struggles, moments of doubt, and the weight of unexpressed emotions shaped me into someone who understands the power of vulnerability and the strength found in community.",
  purposeTitle = "The Purpose Behind This Platform",
  purposeParagraph1 = "This platform was born from a simple truth — that healing begins when we give our pain a voice and our stories a place to belong.",
  purposeParagraph2 = "Days I Do Not Die was the first spark — a raw, unfiltered reflection of survival, faith, and the human spirit's ability to rise again.",
  purposeParagraph3 = "But it didn't end with the book. It evolved into something greater — a movement. A creative and wellness space built to remind people that strength is not the absence of struggle, but the courage to keep showing up. Through storytelling, poetry, and community, we seek to bridge the gap between art and healing — creating a space where authenticity is celebrated, vulnerability is power, and every voice has the right to be heard.",
  missionTitle = "Our Mission",
  missionParagraph1 = "To empower individuals worldwide to embrace their mental health journey with courage, compassion, and community. We believe that every person deserves to live authentically, heal from their past, and find strength in their daily victories.",
  missionParagraph2 = "Through storytelling, education, and meaningful connections, we create safe spaces where vulnerability becomes strength and isolation transforms into belonging.",
  visionTitle = "Our Vision",
  visionParagraph1 = "A world where mental health conversations flow as naturally as breathing, where every individual feels seen, heard, and supported in their journey toward healing and self-discovery.",
  visionParagraph2 = "We envision communities built on empathy, where personal stories become catalysts for collective transformation, and where the simple act of showing up becomes the greatest victory of all.",
  mediaHighlights = [],
}: AboutProps) => {
  return (
    <div className="w-full relative overflow-clip">
      {/* Who I Am Section */}
      <motion.section
        className="w-full relative overflow-hidden min-h-[90vh] flex items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Doodles */}
        <Image
          src="/doodles/doodle-2.svg"
          alt="doodle"
          className="absolute -top-10 md:-top-20 -left-10 md:-left-20 z-[-1]"
          width={200}
          height={200}
        />
        <Image
          src="/doodles/doodle-4.svg"
          alt="doodle"
          className="absolute -bottom-10 md:-bottom-20 -right-10 md:-right-20 z-[-1] rotate-180"
          width={200}
          height={200}
        />

        <div className="container mx-auto px-6 lg:px-8 max-lg:py-10">
          <div className="max-w-5xl 2xl:max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 max-lg:gap-10 2xl:gap-20 items-center">
              {/* Left Column - Image */}
              <motion.div
                className="relative max-w-96 2xl:max-w-4xl mx-auto"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <Image
                    src={whoIAmImage}
                    alt="Thywill Uche - Who I Am"
                    width={400}
                    height={450}
                    className="rounded-3xl shadow-2xl object-cover w-full aspect-[4/5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                </div>
              </motion.div>

              {/* Right Column - Who I Am Content */}
              <motion.div
                className="space-y-8 max-w-96 2xl:max-w-4xl mx-auto"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div>
                  <h1
                    className={`text-5xl lg:text-6xl ${georgiaItalic.className} mb-6`}
                  >
                    {whoIAmTitle}
                  </h1>
                  <div className="w-24 h-1 bg-primary rounded-full mb-8"></div>
                </div>

                <div
                  className={`space-y-6 text-lg 2xl:text-2xl text-justify leading-relaxed ${oswald.className}`}
                >
                  <p>{whoIAmParagraph1}</p>
                  <p>{whoIAmParagraph2}</p>
                  <p>{whoIAmParagraph3}</p>
                  <p>{whoIAmParagraph4}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hero Section - Personal Journey */}
      <motion.section
        className="w-full relative overflow-hidden min-h-[90vh] grid place-content-center"
        id="journey"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Doodles */}
        <Image
          src="/doodles/doodle-1.svg"
          alt="doodle"
          className="absolute -top-10 md:-top-20 -left-10 md:-left-20 z-[-1]"
          width={200}
          height={200}
        />
        <Image
          src="/doodles/doodle-3.svg"
          alt="doodle"
          className="absolute -bottom-10 md:-bottom-20 -right-10 md:-right-20 z-[-1] rotate-180"
          width={200}
          height={200}
        />

        <div className="container mx-auto px-6 lg:px-8 max-lg:py-10">
          <div className="max-w-5xl 2xl:max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-5 max-lg:gap-10 2xl:gap-20 items-center">
              
              {/* Left Column - Journey Narrative */}
              <motion.div
                className="space-y-8 max-w-96 2xl:max-w-4xl mx-auto"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div>
                  <h1
                    className={`text-5xl lg:text-6xl ${georgiaItalic.className} mb-6`}
                  >
                    {journeyTitle}
                  </h1>
                  <div className="w-24 h-1 bg-primary rounded-full mb-8"></div>
                </div>

                <div
                  className={`space-y-6 text-lg 2xl:text-2xl text-justify leading-relaxed ${oswald.className}`}
                >
                  <p>{journeyParagraph1}</p>
                  <p>{journeyParagraph2}</p>
                </div>
              </motion.div>
              {/* Right Column - Image */}
              <motion.div
                className="relative max-w-96 2xl:max-w-4xl mx-auto"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <Image
                    src={journeyImage}
                    alt="Thywill Uche - Personal Journey"
                    width={400}
                    height={450}
                    className="rounded-3xl shadow-2xl object-cover w-full aspect-[4/5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Purpose Section */}
      <motion.section
        className="w-full py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                className={`text-4xl lg:text-5xl ${georgiaItalic.className} mb-8`}
              >
                {purposeTitle}
              </h2>
              <div className="w-24 h-1 bg-primary rounded-full mx-auto mb-12"></div>
            </motion.div>

            <motion.div
              className={`space-y-8 text-lg lg:text-xl text-gray-700 leading-relaxed ${oswald.className}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-justify">{purposeParagraph1}</p>
              <p className="text-justify">{purposeParagraph2}</p>
              <p className="text-justify">{purposeParagraph3}</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section
        className="w-full py-20 lg:py-24 bg-white/50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-5xl lg:text-6xl ${georgiaItalic.className} mb-6`}
              >
                Mission & Vision
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                Guiding principles that drive my work and shape the impact I
                hope to create
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* Mission */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                id="mission"
              >
                <div className="transition-all duration-300 h-full">
                  <h3
                    className={`text-3xl font-semibold mb-6 ${oswald.className}`}
                  >
                    {missionTitle}
                  </h3>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 ${oswald.className} text-justify`}
                  >
                    {missionParagraph1}
                  </p>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 mt-4 ${oswald.className} text-justify`}
                  >
                    {missionParagraph2}
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                id="vision"
              >
                <div className="duration-300 h-full">
                  <h3
                    className={`text-3xl font-semibold mb-6 ${oswald.className}`}
                  >
                    {visionTitle}
                  </h3>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 ${oswald.className} text-justify`}
                  >
                    {visionParagraph1}
                  </p>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 mt-4 ${oswald.className} text-justify`}
                  >
                    {visionParagraph2}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Media Gallery Section */}
      <MediaGallery mediaHighlights={mediaHighlights} />

      <Community />
    </div>
  );
};

export default About;
