"use client";

import Hero from "@/components/home/hero";
import WhoIAm from "@/components/home/who-i-am";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LivePreviewProps {
  initialHeroData: Record<string, string>;
  initialWhoIAmData: Record<string, string>;
  initialSocials: Array<{ key: string; label: string; url: string }>;
}

export function LivePreview({
  initialHeroData,
  initialWhoIAmData,
  initialSocials,
}: LivePreviewProps) {
  const [heroData, setHeroData] = useState(initialHeroData);
  const [whoIAmData, setWhoIAmData] = useState(initialWhoIAmData);
  const [socials, setSocials] = useState(initialSocials);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/home-preview");
      const data = await response.json();

      setHeroData(data.hero || {});
      setWhoIAmData(data.whoIAm || {});
      setSocials(data.socials || []);
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

    window.addEventListener("refreshPreview", handleRefresh);

    return () => {
      window.removeEventListener("refreshPreview", handleRefresh);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">Live Preview</h3>
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
          <Hero
            title1={heroData.title1}
            title2={heroData.title2}
            title3={heroData.title3}
            tagline1={heroData.tagline1}
            tagline2={heroData.tagline2}
            tagline3={heroData.tagline3}
            description={heroData.description}
            heroImage={heroData.heroImage}
            ctaText={heroData.ctaText}
            ctaLink={heroData.ctaLink}
            socials={socials}
          />
          <div className="py-16">
            <WhoIAm
              title={whoIAmData.title}
              description={whoIAmData.description}
              image={whoIAmData.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
