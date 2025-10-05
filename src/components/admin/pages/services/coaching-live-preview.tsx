"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Calendar, MessageCircle } from "lucide-react";
import { Pacifico, Oswald } from "next/font/google";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface CoachingLivePreviewProps {
  initialCoachingData: Record<string, string>;
}

export function CoachingLivePreview({
  initialCoachingData,
}: CoachingLivePreviewProps) {
  const [coachingData, setCoachingData] = useState(initialCoachingData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/services-preview");
      const data = await response.json();

      setCoachingData(data.coaching || {});
    } catch (error) {
      console.error("Failed to refresh preview:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const handleRefresh = () => {
      refreshPreview();
    };

    window.addEventListener("refreshServicesPreview", handleRefresh);

    return () => {
      window.removeEventListener("refreshServicesPreview", handleRefresh);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">Coaching Page Preview</h3>
        <Button
          onClick={refreshPreview}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="scale-50 origin-top-left w-[200%]">
          <div className="w-full relative overflow-clip">
            <section className="w-full relative overflow-hidden min-h-[80vh] flex items-center">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <Users className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <h1
                      className={`text-5xl lg:text-6xl ${pacifico.className}`}
                    >
                      {coachingData.title || "Personal Coaching"}
                    </h1>
                    <div className="w-24 h-1 bg-primary rounded-full"></div>
                    <p
                      className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
                    >
                      {coachingData.description ||
                        "Experience transformative one-on-one coaching that empowers you to overcome challenges, build lasting resilience, and create meaningful change in your life."}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" className="gap-2">
                        <Calendar size={20} />
                        Book a Session
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2">
                        <MessageCircle size={20} />
                        Free Consultation
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative max-w-md 2xl:max-w-xl mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={
                          coachingData.heroImage ||
                          "/images/IMG_20240828_162759[1].jpg"
                        }
                        alt="Personal Coaching"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-20 lg:py-24 bg-white/50">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                    <h2
                      className={`text-4xl lg:text-5xl ${pacifico.className}`}
                    >
                      {coachingData.whatToExpectTitle || "What to Expect"}
                    </h2>
                    <p
                      className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
                    >
                      {coachingData.whatToExpectSubtitle ||
                        "Personalized support tailored to your unique journey"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3
                            className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                          >
                            {coachingData.strategyTitle ||
                              "Personalized Strategy"}
                          </h3>
                          <p className={`text-gray-700 ${oswald.className}`}>
                            {coachingData.strategyDescription ||
                              "Every session is tailored to your specific goals, challenges, and circumstances. We'll work together to create a roadmap that fits your life."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3
                            className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                          >
                            {coachingData.toolsTitle || "Practical Tools"}
                          </h3>
                          <p className={`text-gray-700 ${oswald.className}`}>
                            {coachingData.toolsDescription ||
                              "Leave each session with actionable strategies and techniques you can implement immediately to build resilience and navigate challenges."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3
                            className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                          >
                            {coachingData.accountabilityTitle ||
                              "Accountability & Support"}
                          </h3>
                          <p className={`text-gray-700 ${oswald.className}`}>
                            {coachingData.accountabilityDescription ||
                              "Regular check-ins and ongoing support to help you stay on track and celebrate your progress along the way."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3
                            className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                          >
                            {coachingData.safeSpaceTitle || "Safe Space"}
                          </h3>
                          <p className={`text-gray-700 ${oswald.className}`}>
                            {coachingData.safeSpaceDescription ||
                              "A judgment-free environment where vulnerability is welcomed and authenticity is celebrated. Your story matters."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-20 lg:py-24">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 space-y-6 text-center">
                    <h2
                      className={`text-3xl md:text-4xl font-bold ${oswald.className}`}
                    >
                      {coachingData.whoThisIsForTitle || "Who This Is For"}
                    </h2>
                    <div
                      className={`text-lg text-gray-700 space-y-4 text-left ${oswald.className}`}
                    >
                      <p>
                        {coachingData.whoThisIsForDescription1 ||
                          "My coaching services are designed for individuals who are ready to invest in themselves and their mental wellness journey. Whether you're facing specific challenges or simply want to build a stronger foundation for personal growth, I'm here to support you."}
                      </p>
                      <p>
                        {coachingData.whoThisIsForDescription2 ||
                          "This is for you if you're navigating life transitions, working through mental health challenges, seeking to build resilience, or wanting to live more authentically and purposefully."}
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button size="lg" className="gap-2">
                        Start Your Journey
                        <Users size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
