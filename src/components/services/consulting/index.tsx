"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, Target, Calendar } from "lucide-react";
import { Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface ConsultingPageProps {
  content?: Record<string, string>;
}

const ConsultingPage = ({ content = {} }: ConsultingPageProps) => {
  return (
    <div className="w-full relative overflow-clip">
      <motion.section
        className="w-full relative overflow-hidden min-h-[80vh] flex items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Lightbulb className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className={`text-5xl lg:text-6xl ${georgiaItalic.className}`}>
                {content.title || "Strategic Consulting"}
              </h1>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
              <p
                className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
              >
                {content.description ||
                  "Strategic consulting for organizations, content creators, and individuals looking to build authentic mental health initiatives, develop impactful content, or create meaningful community engagement strategies."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <a href="/services/consulting/booking">
                    <Calendar size={20} />
                    Schedule Consultation
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href="/services/custom">
                    <Target size={20} />
                    Custom Request
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative max-w-md 2xl:max-w-xl mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={
                    content.heroImage || "/images/IMG_20250716_093443[1].jpg"
                  }
                  alt="Strategic Consulting"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-20 lg:py-24 bg-white/50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className={`text-4xl lg:text-5xl ${georgiaItalic.className}`}>
                {content.whatToExpectTitle || "What to Expect"}
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                {content.whatToExpectSubtitle ||
                  "Strategic guidance that creates real impact and authentic connections"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    {content.strategyTitle || "Strategic Planning"}
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    {content.strategyDescription ||
                      "Comprehensive analysis and strategic planning to create initiatives that align with your values and achieve measurable impact."}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    {content.implementationTitle || "Implementation Support"}
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    {content.implementationDescription ||
                      "Hands-on support throughout the implementation process, ensuring your initiatives are executed effectively and sustainably."}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    {content.supportTitle || "Ongoing Support"}
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    {content.supportDescription ||
                      "Continued guidance and support as your initiatives grow, with regular check-ins and strategic adjustments."}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    {content.resultsTitle || "Measurable Results"}
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    {content.resultsDescription ||
                      "Focus on creating initiatives that deliver measurable impact and authentic community engagement."}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-20 lg:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className={`text-4xl lg:text-5xl ${georgiaItalic.className}`}>
                Why Work With Me
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                Experience and authenticity in mental health advocacy
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    Lived Experience
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Deep understanding of mental health challenges and the
                    nuances of creating authentic, impactful advocacy programs.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    Proven Track Record
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Years of experience building engaged communities and
                    creating content that resonates and drives real change.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    Strategic Approach
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Data-driven strategies combined with authentic storytelling
                    to create initiatives that are both impactful and
                    sustainable.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                  >
                    Personalized Solutions
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Every project is tailored to your unique goals, audience,
                    and organizational culture for maximum impact.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-20 lg:py-24 bg-white/50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 space-y-6 text-center">
              <h2
                className={`text-3xl md:text-4xl font-bold ${oswald.className}`}
              >
                Let&apos;s Build Something Meaningful
              </h2>
              <p className={`text-lg text-gray-700 ${oswald.className}`}>
                Whether you&apos;re an organization looking to launch a mental
                health initiative, a content creator wanting to develop your
                brand, or an individual with a vision for community impact,
                I&apos;m here to help you succeed.
              </p>
              <div className="pt-4">
                <Button size="lg" className="gap-2" asChild>
                  <a href="/services/consulting/booking">
                    <Calendar size={20} />
                    Book a Discovery Call
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ConsultingPage;
