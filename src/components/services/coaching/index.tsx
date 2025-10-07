"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Calendar, MessageCircle } from "lucide-react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import { motion } from "framer-motion";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface CoachingPageProps {
  content?: Record<string, string>;
}

const CoachingPage = ({ content = {} }: CoachingPageProps) => {
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
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className={`text-5xl lg:text-6xl ${georgiaItalic.className}`}>
                {content.title || "Personal Coaching"}
              </h1>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
              <p
                className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
              >
                {content.description ||
                  "Experience transformative one-on-one coaching that empowers you to overcome challenges, build lasting resilience, and create meaningful change in your life."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <a href="/services/coaching/booking">
                    <Calendar size={20} />
                    Book a Session
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href="/services/custom">
                    <MessageCircle size={20} />
                    Free Consultation
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
                    content.heroImage || "/images/IMG_20240828_162759[1].jpg"
                  }
                  alt="Personal Coaching"
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
                  "Personalized support tailored to your unique journey"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                    >
                      {content.strategyTitle || "Personalized Strategy"}
                    </h3>
                    <p className={`text-gray-700 ${oswald.className}`}>
                      {content.strategyDescription ||
                        "Every session is tailored to your specific goals, challenges, and circumstances. We'll work together to create a roadmap that fits your life."}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                    >
                      {content.toolsTitle || "Practical Tools"}
                    </h3>
                    <p className={`text-gray-700 ${oswald.className}`}>
                      {content.toolsDescription ||
                        "Leave each session with actionable strategies and techniques you can implement immediately to build resilience and navigate challenges."}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                    >
                      {content.accountabilityTitle ||
                        "Accountability & Support"}
                    </h3>
                    <p className={`text-gray-700 ${oswald.className}`}>
                      {content.accountabilityDescription ||
                        "Regular check-ins and ongoing support to help you stay on track and celebrate your progress along the way."}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                    >
                      {content.safeSpaceTitle || "Safe Space"}
                    </h3>
                    <p className={`text-gray-700 ${oswald.className}`}>
                      {content.safeSpaceDescription ||
                        "A judgment-free environment where vulnerability is welcomed and authenticity is celebrated. Your story matters."}
                    </p>
                  </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 space-y-6 text-center">
              <h2
                className={`text-3xl md:text-4xl font-bold ${oswald.className}`}
              >
                {content.whoThisIsForTitle || "Who This Is For"}
              </h2>
              <div
                className={`text-lg text-gray-700 space-y-4 text-left ${oswald.className}`}
              >
                <p>
                  {content.whoThisIsForDescription1 ||
                    "My coaching services are designed for individuals who are ready to invest in themselves and their mental wellness journey. Whether you're facing specific challenges or simply want to build a stronger foundation for personal growth, I'm here to support you."}
                </p>
                <p>
                  {content.whoThisIsForDescription2 ||
                    "This is for you if you're navigating life transitions, working through mental health challenges, seeking to build resilience, or wanting to live more authentically and purposefully."}
                </p>
              </div>
              <div className="pt-4">
                <Button size="lg" className="gap-2" asChild>
                  <a href="/services/coaching/booking">
                    Start Your Journey
                    <Users size={20} />
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

export default CoachingPage;
