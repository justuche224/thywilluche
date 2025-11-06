"use client";

import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const Championship = () => {
  return (
    <div className="min-h-screen space-y-10">
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
              THYWILL&apos;S CHAMPIONS LEAGUE
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Welcome to Thywill&apos;s Champions League — where readers become
              legends. A movement for minds that listen, feel, and speak truth
              through words. If Days I Do Not Die spoke to you, now&apos;s your
              chance to speak back, and be rewarded.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Every reader has a voice, and every story deserves an echo.
              Thywill&apos;s Champions League is where reflection meets reward; a
              space for truth, creativity, and courage. Review Days I Do Not Die
              in your own words. Be bold. Be original. Be real. The finest
              voices will earn recognition, rewards, and a place among
              tomorrow&apos;s literary legends. This isn&apos;t just a competition, it&apos;s a
              call to rise, write, and be remembered. Proudly sponsored by
              Thywill Fountain of Hope for the Poor Initiative.
            </p>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="relative w-64 h-64 mx-auto">
          <Image
            src="/images/main.jpg"
            width={200}
            height={300}
            alt="Left"
            className="absolute w-56 h-72 object-cover top-8 left-8 rotate-[-10deg] rounded-xl shadow-lg"
          />
          <Image
            src="/images/IMG_20250918_104735[2].jpg"
            width={200}
            height={300}
            alt="Right"
            className="absolute w-56 h-72 object-cover top-4 left-20 rotate-[10deg] rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="py-20 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <h2
            className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
          >
            Registration Requirements
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <ul className="text-left text-gray-800 text-lg space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Be part of the community</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>
                  Purchase the new book{" "}
                  <span className="italic">Days I Do Not Die</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Pay a registration fee of ₦5,000</span>
              </li>
            </ul>
            <div className="mt-8 flex justify-center">
              <motion.button
                className="bg-[#800000] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#600000] transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/championship/registration">Get Started</Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
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
              Have Questions?
            </h2>
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
                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                >
                  Whatsapp Us
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Championship;
