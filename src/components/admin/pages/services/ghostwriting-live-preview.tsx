"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle, BookOpen, Mail } from "lucide-react";
import {  Oswald } from "next/font/google";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { georgiaItalic } from "@/utils/georgia-italic";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface GhostwritingLivePreviewProps {
  initialGhostwritingData: Record<string, string>;
}

export function GhostwritingLivePreview({
  initialGhostwritingData,
}: GhostwritingLivePreviewProps) {
  const [ghostwritingData, setGhostwritingData] = useState(
    initialGhostwritingData
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/services-preview");
      const data = await response.json();

      setGhostwritingData(data.ghostwriting || {});
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
        <h3 className="text-lg font-semibold">Ghostwriting Page Preview</h3>
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
                  <div className="space-y-8 order-2 lg:order-1">
                    <div className="flex items-center gap-3">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <PenTool className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <h1
                      className={`text-5xl lg:text-6xl ${georgiaItalic.className}`}
                    >
                      {ghostwritingData.title || "Professional Ghostwriting"}
                    </h1>
                    <div className="w-24 h-1 bg-primary rounded-full"></div>
                    <p
                      className={`text-xl text-gray-700 leading-relaxed ${oswald.className}`}
                    >
                      {ghostwritingData.description ||
                        "Bring your story to life with professional ghostwriting services that capture your voice, honor your journey, and create compelling narratives that resonate with readers."}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" className="gap-2">
                        <Mail size={20} />
                        Get Started
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2">
                        <BookOpen size={20} />
                        View Portfolio
                      </Button>
                    </div>
                  </div>

                  <div className="relative order-1 lg:order-2">
                    <div className="relative max-w-md 2xl:max-w-xl mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={
                          ghostwritingData.heroImage ||
                          "/images/IMG_20250907_010336[1].jpg"
                        }
                        alt="Ghostwriting Services"
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
                      className={`text-4xl lg:text-5xl ${georgiaItalic.className}`}
                    >
                      {ghostwritingData.whatToExpectTitle || "What to Expect"}
                    </h2>
                    <p
                      className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
                    >
                      {ghostwritingData.whatToExpectSubtitle ||
                        "Collaborative storytelling that honors your voice and vision"}
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
                          {ghostwritingData.processTitle ||
                            "Collaborative Process"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {ghostwritingData.processDescription ||
                            "We work together throughout the entire process, from initial concept to final manuscript, ensuring your voice and vision are preserved."}
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
                          {ghostwritingData.collaborationTitle ||
                            "Authentic Storytelling"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {ghostwritingData.collaborationDescription ||
                            "I specialize in capturing your unique voice and authentic experiences, creating narratives that resonate with your intended audience."}
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
                          {ghostwritingData.qualityTitle ||
                            "Professional Quality"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {ghostwritingData.qualityDescription ||
                            "From manuscript development to final editing, every aspect of your book receives professional attention and polish."}
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
                          {ghostwritingData.confidentialityTitle ||
                            "Complete Confidentiality"}
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          {ghostwritingData.confidentialityDescription ||
                            "Your story is safe with me. I maintain strict confidentiality throughout our collaboration and beyond."}
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
                      className={`text-4xl lg:text-5xl ${georgiaItalic.className}`}
                    >
                      The Process
                    </h2>
                    <p
                      className={`text-xl text-gray-700 max-w-3xl mx-auto ${oswald.className}`}
                    >
                      A collaborative journey from your vision to finished
                      manuscript
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
                          Discovery Call
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          We&apos;ll discuss your vision, goals, and story to
                          ensure we&apos;re the right fit and outline the
                          project scope.
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
                          Research & Outline
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Deep dive into your story through interviews and
                          research, creating a detailed outline for your
                          approval.
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
                          Writing & Revisions
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Crafting your manuscript with regular check-ins and
                          opportunities for feedback and revisions.
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
                          Final Delivery
                        </h3>
                        <p className={`text-gray-700 ${oswald.className}`}>
                          Receive your polished manuscript ready for
                          publication, along with guidance for next steps.
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
                      {ghostwritingData.whoThisIsForTitle ||
                        "Ready to Write Your Story?"}
                    </h2>
                    <p className={`text-lg text-gray-700 ${oswald.className}`}>
                      {ghostwritingData.whoThisIsForDescription1 ||
                        "Let's collaborate to bring your vision to life. Whether you have a fully formed concept or just the seed of an idea, I'm here to help you craft a narrative that truly resonates."}
                    </p>
                    <div className="pt-4">
                      <Button size="lg" className="gap-2">
                        <Mail size={20} />
                        Contact Me
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
