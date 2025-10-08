"use client";

import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import { Star } from "lucide-react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const testimonialsData = [
  {
    id: 1,
    name: "Aisha L.",
    location: "Lagos, Nigeria",
    quote:
      "Thywill just gets it. I feel motivated every time we talk—like I can actually do the things I've been dreaming about.",
    rating: 5,
  },
  {
    id: 2,
    name: "Daniel K.",
    location: "Accra, Ghana",
    quote:
      "I never knew coaching could feel this personal. Thywill helped me see my potential in a whole new way.",
    rating: 5,
  },
  {
    id: 3,
    name: "Zanele M.",
    location: "Johannesburg, South Africa",
    quote:
      "I joined his writing community and now I'm actually finishing projects! Feels amazing to be part of something real.",
    rating: 5,
  },
  {
    id: 4,
    name: "Chuka N.",
    location: "Abuja, Nigeria",
    quote:
      "I feel like a weight has been lifted. Thywill's advice is simple, but it sticks—and it works.",
    rating: 5,
  },
  {
    id: 5,
    name: "Leah S.",
    location: "Nairobi, Kenya",
    quote:
      "Creative ideas used to scare me, but Thywill showed me how to turn them into action. Love it!",
    rating: 5,
  },
  {
    id: 6,
    name: "Kojo B.",
    location: "Kumasi, Ghana",
    quote:
      "It's rare to meet someone who genuinely wants you to grow. Thywill does that, every session.",
    rating: 5,
  },
  {
    id: 7,
    name: "Anita P.",
    location: "Enugu, Nigeria",
    quote:
      "I'm finally finishing my book and feeling confident about it. Couldn't have done it without him!",
    rating: 5,
  },
  {
    id: 8,
    name: "Tomiwa J.",
    location: "Ibadan, Nigeria",
    quote:
      "Every session leaves me inspired. Thywill doesn't just talk—he helps you actually change.",
    rating: 5,
  },
  {
    id: 9,
    name: "Ama T.",
    location: "Cape Town, South Africa",
    quote:
      "Joining Thywill's community was the best decision ever. Supportive, motivating, real.",
    rating: 5,
  },
  {
    id: 10,
    name: "Chinedu O.",
    location: "Ebonyi, Nigeria",
    quote:
      "Thywill's coaching is practical, encouraging, and uplifting. I see myself growing every week.",
    rating: 5,
  },
  {
    id: 11,
    name: "Beatrix Holeck",
    location: "Berkshire, United Kingdom",
    quote:
      "I'm so grateful that Thywill has written a special poem for my book. His talent and heart can be felt through every line. I wish him all the best with his own book too. I know how much it all means to him!!! And I know it's going to touch lives.",
    rating: 5,
  },
];

const Testimonials = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-6xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Client Testimonials
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Hear from those who&apos;ve transformed their lives
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              From Lagos to London, clients around the world share their stories
              of growth, inspiration, and transformation through coaching and
              creative guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                <div className="border-t border-gray-100 pt-4">
                  <p
                    className={`font-semibold text-[#800000] ${oswald.className}`}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 mt-10">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Trusted Globally
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of clients who have transformed their lives through
              coaching, writing guidance, and community support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                100%
              </div>
              <p className="text-lg text-gray-600">5-Star Reviews</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                10+
              </div>
              <p className="text-lg text-gray-600">Countries Served</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                500+
              </div>
              <p className="text-lg text-gray-600">Lives Transformed</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-2 ${oswald.className}`}
              >
                5+
              </div>
              <p className="text-lg text-gray-600">Years of Service</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#800000] text-white">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-6 ${oswald.className}`}
            >
              Ready to Start Your Transformation?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join the community of successful individuals who have taken
              control of their lives and achieved their dreams through
              personalized coaching and guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-[#800000] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Session
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#800000] transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Community
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
