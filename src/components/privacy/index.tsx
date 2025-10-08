"use client";

import React from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Link from "next/link";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Privacy Policy
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Your privacy matters to us
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We are committed to protecting your personal information and being
              transparent about how we collect, use, and safeguard your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6"
              >
                <p className="text-lg text-gray-700 leading-relaxed">
                  We respect your privacy. Any information you share with
                  us—like your name, email, or payment details—is used only to
                  provide our services and improve your experience. We never
                  sell your data.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  Our site may use cookies to enhance browsing. We implement
                  security measures to protect your information. You can request
                  access, correction, or deletion of your data anytime.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  For questions, reach out via our{" "}
                  <Link
                    href="/contact"
                    className="text-[#800000] hover:text-[#600000] font-semibold underline decoration-2 underline-offset-2 transition-colors"
                  >
                    Contact page
                  </Link>
                  .
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-t border-gray-200 pt-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Effective Date:</span>{" "}
                    <span className="text-gray-700">October 1, 2025</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: October 1, 2025
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    className="bg-[#800000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#600000] transition-colors text-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/contact">Contact Us</Link>
                  </motion.button>
                  <motion.button
                    className="border-2 border-[#800000] text-[#800000] px-6 py-3 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition-colors text-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/faq">View FAQ</Link>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="py-20 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Your Rights & Our Commitment
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              We believe in transparency and giving you control over your
              personal information.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold text-[#800000] mb-3 ${oswald.className}`}
                >
                  Data Security
                </h3>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect
                  your personal information from unauthorized access.
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold text-[#800000] mb-3 ${oswald.className}`}
                >
                  Your Control
                </h3>
                <p className="text-gray-700">
                  You can request access, correction, or deletion of your
                  personal data at any time through our contact channels.
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold text-[#800000] mb-3 ${oswald.className}`}
                >
                  Transparency
                </h3>
                <p className="text-gray-700">
                  We are transparent about how we collect and use your
                  information, and we never sell your data to third parties.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Questions About Privacy?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about this privacy policy or how we
              handle your data, we&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-[#800000] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#600000] transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contact">Get in Touch</Link>
              </motion.button>
              <motion.button
                className="border-2 border-[#800000] text-[#800000] px-8 py-4 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/faq">View FAQ</Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
