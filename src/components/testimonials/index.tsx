"use client";

import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

type Testimonial = {
  id: string | number;
  name: string;
  location?: string | null;
  quote: string;
  rating: number;
  work?: string | null;
};

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const router = useRouter();
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
            {testimonials.map((testimonial, index) => (
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
                  {testimonial.work && (
                    <p className="text-sm text-gray-500">
                      - {testimonial.work}
                    </p>
                  )}
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
                onClick={() => router.push("/contact")}
              >
                Book a Session
              </motion.button>
              <motion.button
                onClick={() => router.push("/community/home")}
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
