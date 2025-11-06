import React from "react";
import { Metadata } from "next";
import { Oswald } from "next/font/google";

export const metadata: Metadata = {
  title: "Community Guidelines | Thywill Uche",
  description:
    "Community guidelines for respectful, authentic, and purpose-driven engagement.",
  openGraph: {
    title: "Community Guidelines | Thywill Uche",
    description:
      "Community guidelines for respectful, authentic, and purpose-driven engagement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Guidelines | Thywill Uche",
    description:
      "Community guidelines for respectful, authentic, and purpose-driven engagement.",
  },
};

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const Page = () => {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <h1
          className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-6 ${oswald.className}`}
        >
          Community Guidelines
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Welcome to a space of growth, truth and transformation.
        </p>
        <p className="text-lg text-gray-700 mb-10">
          Here, we rise together; through honesty, kindness and respect.
        </p>

        <div className="space-y-8">
          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              1. Respect Every Voice
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              We’re all learning and healing in different ways. Listen with
              empathy, speak with intention, and treat others as you wish to be
              treated.
            </p>
          </div>

          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              2. No Hate or Harm
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              This is a safe space... no discrimination, harassment, or hateful
              speech of any kind will be tolerated.
            </p>
          </div>

          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              3. Privacy Matters
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              What’s shared here stays here. Protect your own privacy and
              respect the confidentiality of others.
            </p>
          </div>

          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              4. Stay Authentic
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Share your real experiences, insights, and stories. Authenticity
              builds connection, imitation breaks trust.
            </p>
          </div>

          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              5. No Spam or Self-Promotion
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              You’re welcome to inspire, not advertise. Keep conversations
              meaningful and free of unsolicited promotions.
            </p>
          </div>

          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              6. Encourage, Don’t Criticize
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Offer feedback with kindness and understanding. We grow better
              when love leads the lesson.
            </p>
          </div>

          <div>
            <h2
              className={`text-2xl lg:text-3xl font-bold text-[#800000] mb-3 ${oswald.className}`}
            >
              7. Honor the Purpose
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              This community is for healing, learning, and empowerment. Keep the
              energy aligned with those values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
