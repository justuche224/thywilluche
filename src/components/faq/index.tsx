"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Oswald } from "next/font/google";
import Link from "next/link";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const faqData = [
  {
    id: 1,
    question: "Who is Thywill Uche?",
    answer:
      "Writer, poet, ghostwriter, and life coach helping others find strength and purpose.",
  },
  {
    id: 2,
    question: "What do you offer?",
    answer:
      "Life coaching, creative writing guidance, ghostwriting, and transformative programs.",
  },
  {
    id: 3,
    question: "How can I book a session?",
    answer: 'Book online through our "Book a Session" page.',
  },
  {
    id: 4,
    question: "Are your programs online?",
    answer: "Yes, accessible worldwide for personal growth and transformation.",
  },
  {
    id: 5,
    question: "Can I hire you as a ghostwriter?",
    answer: "Absolutely—your story, your voice, professionally crafted.",
  },
  {
    id: 6,
    question: "Where can I buy Days I Do Not Die?",
    answer: "Available on major online shops and directly on our website.",
  },
  {
    id: 7,
    question: "Do you mentor writers?",
    answer: "Yes—mentorship and guidance to grow your craft and career.",
  },
  {
    id: 8,
    question: "What is your coaching style?",
    answer: "Practical, empowering, and focused on real-life transformation.",
  },
  {
    id: 9,
    question: "How do I join your creative community?",
    answer: "Sign up on our website for workshops, forums, and networking.",
  },
  {
    id: 10,
    question: "How can I contact you?",
    answer: 'Use the "Contact" page for inquiries or collaborations.',
  },
  {
    id: 11,
    question: "How can I share my story or collaborate with you?",
    answer:
      "We welcome creative collaborations and authentic stories. Use the Contact Page or reach out directly, we'll review your story and guide you on how to share it with our community.",
  },
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Find answers to common questions about my services and programs
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Whether you&apos;re looking for life coaching, ghostwriting
              services, or want to join our creative community, we&apos;ve got
              you covered with answers to your most pressing questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {faqData.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.button
                  className="w-full px-8 py-6 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleItem(faq.id)}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <h3
                    className={`text-lg lg:text-xl font-semibold text-[#800000] pr-4 ${oswald.className}`}
                  >
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-6 w-6 text-[#800000]" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 pt-2">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to
              help you on your journey of transformation and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-[#800000] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#600000] transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contact">Contact Us</Link>
              </motion.button>
              <motion.button
                className="border-2 border-[#800000] text-[#800000] px-8 py-4 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/services">Book a Session</Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
