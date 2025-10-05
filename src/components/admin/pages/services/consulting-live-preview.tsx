"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, Target, Calendar } from "lucide-react";
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

interface ConsultingLivePreviewProps {
  initialConsultingData: Record<string, string>;
}

export function ConsultingLivePreview({
  initialConsultingData,
}: ConsultingLivePreviewProps) {
  const [consultingData, setConsultingData] = useState(initialConsultingData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/services-preview");
      const data = await response.json();

      setConsultingData(data.consulting || {});
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
        <h3 className="text-lg font-semibold">Consulting Page Preview</h3>
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
                        <Lightbulb className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <h1
                      className={`text-5xl lg:text-6xl ${pacifico.className}`}
                    >
                      {consultingData.title || "Strategic Consulting"}
                    </h1>
                    <div className="w-24 h-1 bg-primary rounded-full"></div>
                    <p
                      className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
                    >
                      {consultingData.description ||
                        "Strategic consulting for organizations, content creators, and individuals looking to build authentic mental health initiatives, develop impactful content, or create meaningful community engagement strategies."}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" className="gap-2">
                        <Calendar size={20} />
                        Schedule Consultation
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2">
                        <Target size={20} />
                        Learn More
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative max-w-md 2xl:max-w-xl mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={
                          consultingData.heroImage ||
                          "/images/IMG_20250716_093443[1].jpg"
                        }
                        alt="Strategic Consulting"
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
                      {consultingData.whatToExpectTitle || "What to Expect"}
                    </h2>
                    <p
                      className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
                    >
                      {consultingData.whatToExpectSubtitle ||
                        "Strategic guidance that creates real impact and authentic connections"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          {consultingData.strategyTitle || "Strategic Planning"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {consultingData.strategyDescription ||
                            "Comprehensive analysis and strategic planning to create initiatives that align with your values and achieve measurable impact."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          {consultingData.implementationTitle ||
                            "Implementation Support"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {consultingData.implementationDescription ||
                            "Hands-on support throughout the implementation process, ensuring your initiatives are executed effectively and sustainably."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          {consultingData.supportTitle || "Ongoing Support"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {consultingData.supportDescription ||
                            "Continued guidance and support as your initiatives grow, with regular check-ins and strategic adjustments."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          {consultingData.resultsTitle || "Measurable Results"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {consultingData.resultsDescription ||
                            "Focus on creating initiatives that deliver measurable impact and authentic community engagement."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-20 lg:py-24">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    <h2
                      className={`text-4xl lg:text-5xl ${pacifico.className}`}
                    >
                      Why Work With Me
                    </h2>
                    <p
                      className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
                    >
                      Experience and authenticity in mental health advocacy
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          Lived Experience
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Deep understanding of mental health challenges and the
                          nuances of creating authentic, impactful advocacy
                          programs.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          Proven Track Record
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Years of experience building engaged communities and
                          creating content that resonates and drives real
                          change.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          Strategic Approach
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Data-driven strategies combined with authentic
                          storytelling to create initiatives that are both
                          impactful and sustainable.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-semibold mb-2 ${oswald.className}`}
                        >
                          Personalized Solutions
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Every project is tailored to your unique goals,
                          audience, and organizational culture for maximum
                          impact.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-20 lg:py-24 bg-white/50">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 space-y-6 text-center">
                    <h2
                      className={`text-3xl md:text-4xl font-bold ${oswald.className}`}
                    >
                      {consultingData.whoThisIsForTitle ||
                        "Let's Build Something Meaningful"}
                    </h2>
                    <p className={`text-lg text-gray-700 ${oswald.className}`}>
                      {consultingData.whoThisIsForDescription1 ||
                        "Whether you're an organization looking to launch a mental health initiative, a content creator wanting to develop your brand, or an individual with a vision for community impact, I'm here to help you succeed."}
                    </p>
                    <div className="pt-4">
                      <Button size="lg" className="gap-2">
                        <Calendar size={20} />
                        Book a Discovery Call
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
