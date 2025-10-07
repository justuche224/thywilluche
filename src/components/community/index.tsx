"use client";

import React from "react";
import Image from "next/image";
import {  Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageCircle,
  PenTool,
  Heart,
  BookOpen,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { georgiaItalic } from "@/utils/georgia-italic";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const communityGroups = [
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Poetry Corner",
    description:
      "Share your poetic expressions, discover new voices, and explore the art of verse in a supportive creative space.",
    members: "2.3k",
    color: "bg-purple-500",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Lifestyle & Wellness",
    description:
      "Connect over daily practices, mental health journeys, and lifestyle choices that support holistic wellbeing.",
    members: "3.1k",
    color: "bg-blue-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Coaching Circle",
    description:
      "A dedicated space for growth-focused discussions, accountability partners, and sharing transformation stories.",
    members: "1.8k",
    color: "bg-green-500",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Writers' Corner",
    description:
      "Collaborate with fellow writers, exchange feedback, share your work, and grow your craft together.",
    members: "2.7k",
    color: "bg-orange-500",
  },
];

const features = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Live Forum Discussions",
    description:
      "Engage in real-time conversations with readers, writers, and community members from around the world.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Supportive Community",
    description:
      "Connect with like-minded individuals who understand your journey and celebrate your victories.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Share Your Story",
    description:
      "Post your experiences, testimonies, and insights to inspire others on their path to healing.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Safe & Moderated",
    description:
      "All posts are reviewed by our team to ensure a respectful, supportive environment for everyone.",
  },
];

const CommunityPage = () => {
  return (
    <div className="w-full relative overflow-clip">
      <motion.section
        className="w-full relative overflow-hidden min-h-[80vh] flex items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
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

        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h1 className={`text-5xl lg:text-6xl ${georgiaItalic.className}`}>
                  Join Our Community
                </h1>
                <div className="w-24 h-1 bg-primary rounded-full mt-6"></div>
              </div>
              <p
                className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
              >
                A safe space where vulnerability becomes strength, stories
                inspire healing, and every voice matters. Connect with thousands
                who understand your journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  <Users size={20} />
                  Join Community
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Learn More
                  <ArrowRight size={20} />
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div
                    className={`text-3xl font-bold text-primary ${oswald.className}`}
                  >
                    10k+
                  </div>
                  <p className={`text-sm text-gray-600 ${oswald.className}`}>
                    Active Members
                  </p>
                </div>
                <div>
                  <div
                    className={`text-3xl font-bold text-primary ${oswald.className}`}
                  >
                    50k+
                  </div>
                  <p className={`text-sm text-gray-600 ${oswald.className}`}>
                    Posts & Stories
                  </p>
                </div>
                <div>
                  <div
                    className={`text-3xl font-bold text-primary ${oswald.className}`}
                  >
                    4
                  </div>
                  <p className={`text-sm text-gray-600 ${oswald.className}`}>
                    Community Groups
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/community.jpg"
                  alt="ThyWillUche Community"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
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
                Community Groups
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                Find your tribe in one of our vibrant community groups
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {communityGroups.map((group, index) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`${group.color} p-4 rounded-xl text-white shrink-0`}
                    >
                      {group.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3
                          className={`text-2xl font-bold ${oswald.className}`}
                        >
                          {group.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className={`text-sm ${oswald.className}`}>
                            {group.members}
                          </span>
                        </div>
                      </div>
                      <p className={`text-gray-700 ${oswald.className}`}>
                        {group.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
                <h2 className={`text-4xl lg:text-5xl ${georgiaItalic.className}`}>
                Community Features
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                Everything you need to connect, share, and grow together
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold mb-2 ${oswald.className}`}
                    >
                      {feature.title}
                    </h3>
                    <p className={`text-gray-700 ${oswald.className}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
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
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 space-y-8">
              <div className="text-center">
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-6 ${oswald.className}`}
                >
                  Our Community Values
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Respect & Empathy",
                    description:
                      "Every member deserves to be heard and respected, regardless of where they are on their journey.",
                  },
                  {
                    title: "Authentic Sharing",
                    description:
                      "Vulnerability is strength. Share your truth and celebrate the courage it takes to be real.",
                  },
                  {
                    title: "Safe Space",
                    description:
                      "All posts are moderated to maintain a supportive, judgment-free environment for everyone.",
                  },
                  {
                    title: "Growth & Support",
                    description:
                      "We're here to lift each other up, celebrate victories, and provide encouragement through challenges.",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-1 ${oswald.className}`}
                      >
                        {value.title}
                      </h3>
                      <p className={`text-gray-700 ${oswald.className}`}>
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
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
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div>
              <h2 className={`text-4xl lg:text-5xl ${georgiaItalic.className} mb-6`}>
                Ready to Connect?
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-2xl mx-auto ${oswald.className}`}
              >
                Join thousands of individuals who have found support,
                inspiration, and authentic connection in our community. Your
                story matters, and we&apos;re here to listen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-base">
                <Users size={20} />
                Join the Community
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <MessageCircle size={20} />
                Explore Groups
              </Button>
            </div>

            <div className="pt-8">
              <p className={`text-sm text-gray-600 ${oswald.className}`}>
                By joining, you agree to our community guidelines and understand
                that all posts are subject to approval to maintain a safe and
                supportive environment.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CommunityPage;
