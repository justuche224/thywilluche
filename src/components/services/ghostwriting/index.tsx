"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle, BookOpen, Mail } from "lucide-react";
import { Pacifico, Oswald } from "next/font/google";
import { motion } from "framer-motion";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface GhostwritingPageProps {
  content?: Record<string, string>;
}

const GhostwritingPage = ({ content = {} }: GhostwritingPageProps) => {
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
              className="space-y-8 order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <PenTool className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className={`text-5xl lg:text-6xl ${pacifico.className}`}>
                {content.title || "Professional Ghostwriting"}
              </h1>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
              <p
                className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
              >
                {content.description ||
                  "Bring your story to life with professional ghostwriting services that capture your voice, honor your journey, and create compelling narratives that resonate with readers."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  <Mail size={20} />
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen size={20} />
                  View Portfolio
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative  max-w-md 2xl:max-w-xl mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={
                    content.heroImage || "/images/IMG_20250907_010336[1].jpg"
                  }
                  alt="Ghostwriting Services"
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
              <h2 className={`text-4xl lg:text-5xl ${pacifico.className}`}>
                Services Offered
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                Comprehensive writing support from concept to completion
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/IMG_20250907_010252[1].jpg"
                    alt="Memoirs"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h3 className={`text-2xl font-semibold ${oswald.className}`}>
                  Memoirs & Life Stories
                </h3>
                <p className={`text-gray-700 ${oswald.className}`}>
                  Transform your experiences into compelling narratives that
                  preserve your legacy and inspire others through authentic
                  storytelling.
                </p>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/IMG_20250907_010336[1].jpg"
                    alt="Self-Help"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h3 className={`text-2xl font-semibold ${oswald.className}`}>
                  Self-Help & Motivational
                </h3>
                <p className={`text-gray-700 ${oswald.className}`}>
                  Share your insights and lessons with the world through
                  engaging self-help books that create real impact and
                  transformation.
                </p>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/IMG_20250918_104735[2].jpg"
                    alt="Content Development"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h3 className={`text-2xl font-semibold ${oswald.className}`}>
                  Manuscript Development
                </h3>
                <p className={`text-gray-700 ${oswald.className}`}>
                  Professional editing, restructuring, and refinement to take
                  your existing manuscript to the next level of excellence.
                </p>
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
              <h2 className={`text-4xl lg:text-5xl ${pacifico.className}`}>
                The Process
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
              >
                A collaborative journey from your vision to finished manuscript
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
                    Discovery Call
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    We&apos;ll discuss your vision, goals, and story to ensure
                    we&apos;re the right fit and outline the project scope.
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
                    Research & Outline
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Deep dive into your story through interviews and research,
                    creating a detailed outline for your approval.
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
                    Writing & Revisions
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Crafting your manuscript with regular check-ins and
                    opportunities for feedback and revisions.
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
                    Final Delivery
                  </h3>
                  <p className={`text-gray-700 ${oswald.className}`}>
                    Receive your polished manuscript ready for publication,
                    along with guidance for next steps.
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
                Ready to Write Your Story?
              </h2>
              <p className={`text-lg text-gray-700 ${oswald.className}`}>
                Let&apos;s collaborate to bring your vision to life. Whether you
                have a fully formed concept or just the seed of an idea,
                I&apos;m here to help you craft a narrative that truly
                resonates.
              </p>
              <div className="pt-4">
                <Button size="lg" className="gap-2">
                  <Mail size={20} />
                  Contact Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default GhostwritingPage;
