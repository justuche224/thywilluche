"use client";

import React from "react";
import Image from "next/image";
import { Pacifico, Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import Community from "../home/community";
import MediaGallery from "./media-gallery";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const About = () => {
  return (
    <div className="w-full relative overflow-clip">
      {/* Hero Section - Personal Journey */}
      <motion.section
        className="w-full relative overflow-hidden min-h-[90vh] gird place-content-center"
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
                    src="/images/IMG_20240828_162619[1].jpg"
                    alt="Thywill Uche - Personal Journey"
                    width={400}
                    height={450}
                    className="rounded-3xl shadow-2xl object-cover w-full aspect-[4/5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                </div>
              </motion.div>

              {/* Right Column - Journey Narrative */}
              <motion.div
                className="space-y-8 max-w-96 2xl:max-w-4xl mx-auto"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div>
                  <h1
                    className={`text-5xl lg:text-6xl ${pacifico.className} mb-6`}
                  >
                    My Journey
                  </h1>
                  <div className="w-24 h-1 bg-primary rounded-full mb-8"></div>
                </div>

                <div
                  className={`space-y-6 text-lg 2xl:text-2xl text-justify leading-relaxed ${oswald.className}`}
                >
                  <p>
                    From the depths of personal struggle to becoming a beacon of
                    hope for thousands, my journey has been one of
                    transformation, resilience, and unwavering commitment to
                    living authentically.
                  </p>
                  <p>
                    Growing up, I faced challenges that tested my spirit and
                    questioned my path. Mental health struggles, moments of
                    doubt, and the weight of unexpressed emotions shaped me into
                    someone who understands the power of vulnerability and the
                    strength found in community.
                  </p>
                </div>
              </motion.div>
            </div>
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
              <h2 className={`text-5xl lg:text-6xl ${pacifico.className} mb-6`}>
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
              >
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <motion.div
                    className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-8"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Target className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h3
                    className={`text-3xl font-semibold mb-6 ${oswald.className}`}
                  >
                    Our Mission
                  </h3>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 ${oswald.className}`}
                  >
                    To empower individuals worldwide to embrace their mental
                    health journey with courage, compassion, and community. We
                    believe that every person deserves to live authentically,
                    heal from their past, and find strength in their daily
                    victories.
                  </p>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 mt-4 ${oswald.className}`}
                  >
                    Through storytelling, education, and meaningful connections,
                    we create safe spaces where vulnerability becomes strength
                    and isolation transforms into belonging.
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
              >
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <motion.div
                    className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mb-8"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Eye className="w-10 h-10 text-secondary" />
                  </motion.div>
                  <h3
                    className={`text-3xl font-semibold mb-6 ${oswald.className}`}
                  >
                    Our Vision
                  </h3>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 ${oswald.className}`}
                  >
                    A world where mental health conversations flow as naturally
                    as breathing, where every individual feels seen, heard, and
                    supported in their journey toward healing and
                    self-discovery.
                  </p>
                  <p
                    className={`text-lg leading-relaxed text-gray-700 mt-4 ${oswald.className}`}
                  >
                    We envision communities built on empathy, where personal
                    stories become catalysts for collective transformation, and
                    where the simple act of showing up becomes the greatest
                    victory of all.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Media Gallery Section */}
      <MediaGallery />

      <Community />
    </div>
  );
};

export default About;
