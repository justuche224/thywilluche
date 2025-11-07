"use client";

import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy } from "lucide-react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const ChampionshipAnnouncement = () => {
  return (
    <motion.section
      className="w-full py-20 lg:py-24 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#800000]/5 via-[#800000]/10 to-[#600000]/5 -z-10"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-[#800000]" />
              <h2
                className={`text-4xl lg:text-5xl font-bold text-[#800000] ${oswald.className}`}
              >
                THYWILL&apos;S CHAMPIONS LEAGUE
              </h2>
              <Trophy className="w-8 h-8 text-[#800000]" />
            </div>
            <p
              className={`text-xl lg:text-2xl text-gray-700 mb-4 font-semibold ${oswald.className}`}
            >
              Where Readers Become Legends
            </p>
            <p
              className={`text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed ${oswald.className}`}
            >
              A movement for minds that listen, feel, and speak truth through
              words. Review{" "}
              <span className="italic font-semibold">Days I Do Not Die</span> in
              your own words. Be bold. Be original. Be real.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              className=""
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              {/* <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#800000]" />
              </div> */}
              <h3
                className={`text-lg font-semibold mb-2 text-[#800000] ${oswald.className}`}
              >
                Read the Book
              </h3>
              <p className={`text-sm text-gray-600 ${oswald.className}`}>
                Purchase and read{" "}
                <span className="italic">Days I Do Not Die</span> to participate
              </p>
            </motion.div>

            <motion.div
              className=""
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              {/* <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#800000]" />
              </div> */}
              <h3
                className={`text-lg font-semibold mb-2 text-[#800000] ${oswald.className}`}
              >
                Join the Community
              </h3>
              <p className={`text-sm text-gray-600 ${oswald.className}`}>
                Be part of our community and connect with fellow readers
              </p>
            </motion.div>

            <motion.div
              className=""
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              {/* <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-[#800000]" />
              </div> */}
              <h3
                className={`text-lg font-semibold mb-2 text-[#800000] ${oswald.className}`}
              >
                Win Rewards
              </h3>
              <p className={`text-sm text-gray-600 ${oswald.className}`}>
                The finest voices earn recognition, rewards, and a place among
                legends
              </p>
            </motion.div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-[#800000] to-[#600000] rounded-2xl p-8 lg:p-12 text-center text-white shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
              <h3
                className={`text-3xl lg:text-4xl font-bold mb-4 ${oswald.className}`}
              >
                Ready to Make Your Voice Heard?
              </h3>
              <p
                className={`text-lg lg:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-95 ${oswald.className}`}
              >
                This isn&apos;t just a competition, it&apos;s a call to rise,
                write, and be remembered. The finest voices will earn
                recognition, rewards, and a place among tomorrow&apos;s literary
                legends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Button
                    asChild
                    size="lg"
                    className={`px-8 py-6 text-lg bg-white text-[#800000] hover:bg-gray-100 ${oswald.className}`}
                  >
                    <Link href="/championship">Learn More</Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className={`px-8 py-6 text-lg border-2 border-white text-black hover:bg-white/10 ${oswald.className}`}
                  >
                    <Link href="/championship/registration">Register Now</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ChampionshipAnnouncement;
