"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Heart, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {  Oswald } from "next/font/google";
import { motion } from "framer-motion";
import { georgiaItalic } from "@/utils/georgia-italic";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const Community = () => {
  return (
    <motion.div
      className="w-full relative py-20 lg:py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Image
        src="/images/community.jpg"
        alt="Community background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 bg-black/40 -z-5"></div>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-5xl lg:text-6xl ${georgiaItalic.className} mb-6 text-white`}
            >
              Join Our Community
            </h2>
            <p
              className={`text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed ${oswald.className}`}
            >
              Connect with like-minded individuals on a journey of growth,
              healing, and daily victories. Share your story, find support, and
              discover strength in numbers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              className="rounded-2xl p-8 text-center shadow-lg backdrop-blur-sm text-white cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <motion.div
                className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Users className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className={`text-2xl font-semibold mb-4 ${oswald.className}`}>
                Supportive Network
              </h3>
              <p className={`text-white leading-relaxed ${oswald.className}`}>
                Connect with others who understand your journey and share
                similar experiences of growth and resilience.
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl p-8 text-center shadow-lg backdrop-blur-sm text-white cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Heart className="w-8 h-8 text-secondary" />
              </motion.div>
              <h3 className={`text-2xl font-semibold mb-4 ${oswald.className}`}>
                Daily Inspiration
              </h3>
              <p className={`text-white leading-relaxed ${oswald.className}`}>
                Receive daily tips, motivational content, and stories that
                remind you that every day is a victory worth celebrating.
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl p-8 text-center shadow-lg backdrop-blur-sm text-white cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <MessageCircle className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className={`text-2xl font-semibold mb-4 ${oswald.className}`}>
                Meaningful Conversations
              </h3>
              <p className={`text-white leading-relaxed ${oswald.className}`}>
                Engage in thoughtful discussions about mental health, personal
                growth, and the power of daily victories.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="rounded-3xl p-8 lg:p-12 text-center shadow-xl backdrop-blur-sm text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -3 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            </motion.div>
            <h3
              className={`text-3xl lg:text-4xl font-semibold mb-6 ${oswald.className} text-white`}
            >
              Ready to Begin Your Journey?
            </h3>
            <p
              className={`text-lg lg:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed ${oswald.className}`}
            >
              Join thousands of individuals who are transforming their lives one
              day at a time. Your story matters, and your victory is worth
              sharing.
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
                  className={`px-8 py-6 text-lg ${oswald.className} bg-primary hover:bg-primary/90`}
                >
                  <Link href="#">Join Community</Link>
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
                  className={`px-8 py-6 text-lg ${oswald.className} border-2 text-black`}
                >
                  <Link href="#">Learn More</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Community;
