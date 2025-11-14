import React from "react";
import { Metadata } from "next";
import { DonationForm } from "@/components/ngo/donation-form";
import { Oswald } from "next/font/google";
import { Heart } from "lucide-react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Donate - Thywill Fountain of Hope",
  description:
    "Fuel a dream. Support our mission to empower communities through education, healthcare, and sustainable development.",
  icons: {
    icon: "/logos/NGO.png",
  },
};

const DonatePage = async () => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center w-full h-screen z-[-1]">
        <div className="w-full h-full opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-[#800000]/10 to-transparent" />
        </div>
      </div>

      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#800000]/10 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-[#800000]" />
              </div>
            </div>
            <h1
              className={`text-4xl lg:text-5xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Donate Now
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-4">
              Fuel a dream
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Your financial support helps us fund community work, provide
              health support, cover production costs, and expand our coaching
              outreach. Every contribution makes a difference in creating
              lasting positive change.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
              <DonationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
