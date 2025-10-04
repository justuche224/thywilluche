import Image from "next/image";
import React from "react";
import { Facebook, Instagram, X, Youtube, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  x: X,
  youtube: Youtube,
};

interface Social {
  key: string;
  label: string;
  url: string;
}

interface HeroProps {
  title1?: string;
  title2?: string;
  title3?: string;
  tagline1?: string;
  tagline2?: string;
  tagline3?: string;
  description?: string;
  heroImage?: string;
  ctaText?: string;
  ctaLink?: string;
  socials?: Social[];
}

const Hero = ({
  title1 = "365 TIPS,",
  title2 = "365 WINS,",
  title3 = "EVERY DAY IS VICTORY",
  tagline1 = "Connecting hearts.",
  tagline2 = "Uplifting minds.",
  tagline3 = "Living one day at a time.",
  description = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque voluptatem possimus praesentium. Voluptatum quod ea, eligendi velit quam voluptate, iusto quia sequi, sapiente sit suscipit enim! Temporibus ex ipsa nam.",
  heroImage = "/images/IMG_20240828_162759[1].jpg",
  ctaText = "Explore Works",
  ctaLink = "#",
  socials = [],
}: HeroProps) => {
  return (
    <div className="min-h-screen w-full relative">
      <Image
        src={"/doodles/doodle-4.svg"}
        alt="doodle"
        className="absolute max-2xl:hidden bottom-70 w-full z-[-1] h-10 "
        width={200}
        height={200}
      />
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20 xl:pt-0">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center min-h-[70vh]">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-8">
              <h1
                className={`text-6xl lg:text-6xl 2xl:text-8xl font-bold tracking-tight leading-none ${oswald.className} max-lg:text-center`}
              >
                <span className="block mb-2">{title1}</span>
                <span className="block mb-2">{title2}</span>
                <span className="block">{title3}</span>
              </h1>

              {socials.length > 0 && (
                <div className="space-y-6">
                  <p
                    className={`text-xl font-semibold max-lg:text-center ${oswald.className}`}
                  >
                    Find Me Online
                  </p>
                  <div className="flex gap-4 max-lg:justify-center">
                    {socials.map((social) => {
                      const IconComponent = iconMap[social.key.toLowerCase()];
                      return (
                        <Button
                          size="icon"
                          variant="outline"
                          asChild
                          key={social.key}
                          className={`h-12 w-12 ${oswald.className}`}
                        >
                          <Link
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {IconComponent ? <IconComponent /> : <X />}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Column - Hero Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <Image
                src={heroImage}
                alt="hero"
                width={400}
                height={500}
                className="rounded-t-full object-cover h-[500px] w-[400px] lg:h-[600px] lg:w-[480px]"
              />
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="lg:col-span-4 space-y-8">
            <h2
              className={`text-4xl 2xl:text-5xl font-semibold leading-tight ${oswald.className}`}
            >
              {tagline1}
              <br />
              {tagline2}
              <br />
              {tagline3}
            </h2>

            <p
              className={`text-lg xl:text-xl leading-relaxed text-gray-700 ${oswald.className} text-justify`}
            >
              {description}
            </p>

            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className={`px-8 py-6 text-lg ${oswald.className}`}
              >
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Featured Content */}
        {/* <div className="mt-24 lg:mt-32">
          <div className="bg-white/60 rounded-3xl p-8 lg:p-12 relative min-h-[350px]">
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl font-semibold px-8 py-3 h-auto">
              Out Now!
            </Badge>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <div className="aspect-video relative overflow-hidden rounded-2xl">
                <Image
                  src={"/images/IMG_20250907_010252[1].jpg"}
                  className="object-cover"
                  alt="featured content"
                  fill
                />
              </div>
              
              <div className="aspect-video relative overflow-hidden rounded-2xl hidden lg:block">
                <Image
                  src={"/images/IMG_20250907_010252[1].jpg"}
                  className="object-cover"
                  alt="featured content"
                  fill
                />
              </div>
              
              <div className="aspect-video relative overflow-hidden rounded-2xl">
                <Image
                  src={"/images/IMG_20250907_010336[1].jpg"}
                  className="object-cover"
                  alt="featured content"
                  fill
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
