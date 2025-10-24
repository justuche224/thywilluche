"use client";

import React from "react";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { MediaHighlight } from "@/db/schema/media-highlights";
import { georgiaItalic } from "@/utils/georgia-italic";
  

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface MediaGalleryProps {
  mediaHighlights: MediaHighlight[];
}

const MediaGallery = ({ mediaHighlights }: MediaGalleryProps) => {
  return (
    <motion.section
      className="w-full py-20 lg:py-24 bg-gradient-to-br from-white via-white/50 to-primary/5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      id="media"
    >
      {/* Background Doodles */}
      <Image
        src="/doodles/doodle-2.svg"
        alt="doodle"
        className="absolute -top-20 -right-20 z-[-1] opacity-60"
        width={300}
        height={300}
      />
      <Image
        src="/doodles/doodle-4.svg"
        alt="doodle"
        className="absolute bottom-10 -left-10 z-[-1] opacity-60"
        width={250}
        height={250}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-5xl lg:text-6xl ${georgiaItalic.className} mb-6`}>
                Media Highlights
              </h2>
              <div className="w-24 h-1 bg-primary rounded-full mx-auto mb-8"></div>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed ${oswald.className}`}
              >
                Stories that inspire, voices that matter, and moments that
                connect us all in the journey toward healing and growth.
              </p>
            </motion.div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {mediaHighlights.length > 0 ? (
              mediaHighlights.map((item, index) => {
                return (
                  <motion.div
                    key={item.id}
                    className="group relative"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    {/* Featured Badge for special items */}
                    {item.type === "featured" && (
                      <motion.div
                        className="absolute -top-3 -right-3 z-20 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Star className="w-3 h-3" />
                        Featured
                      </motion.div>
                    )}

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full">
                      {/* Image Section */}
                      <div className="relative h-48 lg:h-56 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        {/* Date Badge */}
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {item.date}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 lg:p-8">
                        <h3
                          className={`text-xl lg:text-2xl font-semibold mb-3 ${oswald.className} text-gray-800`}
                        >
                          {item.title}
                        </h3>

                        <p
                          className={`text-sm lg:text-base text-gray-600 mb-4 leading-relaxed ${oswald.className}`}
                        >
                          {item.description}
                        </p>

                        {/* Quote Section */}
                        <div className="relative bg-gray-50 rounded-2xl p-4">
                          <Quote
                            className={`w-5 h-5 ${
                              item.color === "primary"
                                ? "text-primary"
                                : "text-secondary"
                            } mb-2`}
                          />
                          <p
                            className={`text-sm lg:text-base italic text-gray-700 ${oswald.className}`}
                          >
                            &quot;{item.quote}&quot;
                          </p>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <motion.div
                        className={`absolute inset-0 rounded-3xl border-2 ${
                          item.color === "primary"
                            ? "border-primary"
                            : "border-secondary"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                        style={{ margin: "-2px" }}
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className={`text-lg text-gray-600 ${oswald.className}`}>
                  No media highlights available at the moment.
                </p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          {/* <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
              </motion.div>
              <h3
                className={`text-3xl lg:text-4xl font-semibold mb-6 ${oswald.className} text-gray-800`}
              >
                The Journey Continues
              </h3>
              <p
                className={`text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 ${oswald.className}`}
              >
                Every story shared, every conversation started, every life
                touched - these are the milestones that define our collective
                path forward.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                  { number: "50+", label: "Media Features" },
                  { number: "2M+", label: "Lives Touched" },
                  { number: "100K+", label: "Community Members" },
                  { number: "5+", label: "Awards Won" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <div
                      className={`text-2xl lg:text-3xl font-bold ${oswald.className} text-primary mb-2`}
                    >
                      {stat.number}
                    </div>
                    <div
                      className={`text-sm text-gray-600 ${oswald.className}`}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </motion.section>
  );
};

export default MediaGallery;
