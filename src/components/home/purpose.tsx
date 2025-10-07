"use client";

import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"] });

interface PurposeProps {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
}

export default function Purpose({
  title = "The Purpose Behind This Platform",
  paragraph1 = "This platform was born from a simple truth — that healing begins when we give our pain a voice and our stories a place to belong.",
  paragraph2 = "Days I Do Not Die was the first spark — a raw, unfiltered reflection of survival, faith, and the human spirit's ability to rise again.",
  paragraph3 = "But it didn't end with the book. It evolved into something greater — a movement. A creative and wellness space built to remind people that strength is not the absence of struggle, but the courage to keep showing up. Through storytelling, poetry, and community, we seek to bridge the gap between art and healing — creating a space where authenticity is celebrated, vulnerability is power, and every voice has the right to be heard.",
}: PurposeProps) {
  return (
    <motion.section
      className="w-full py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white"
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
              {title}
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
            <p className="text-justify">{paragraph1}</p>
            <p className="text-justify">{paragraph2}</p>
            <p className="text-justify">{paragraph3}</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
