import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, PenTool, ArrowRight } from "lucide-react";
import { Oswald } from "next/font/google";
import { getServiceSection } from "@/actions/services-content";
import { georgiaItalic } from "@/utils/georgia-italic";
import type { Metadata } from "next";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServiceSection("overview");
  const title = content.title || "Services | Thywill Uche";
  const description =
    content.subtitle ||
    "Transform your vision into reality with personalized guidance, expert consulting, and professional writing services tailored to your unique journey.";

  return {
    title,
    description,
    keywords: [
      "services",
      "coaching",
      "consulting",
      "ghostwriting",
      "life coaching",
      "personal development",
      "mental wellness",
      "Thywill Uche services",
      "professional writing",
      "book writing",
      "content strategy",
    ],
    openGraph: {
      title,
      description,
      url: "https://thywilluche.com/services",
      siteName: "Thywill Uche",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://thywilluche.com/images/main.jpg",
          width: 1200,
          height: 630,
          alt: "Thywill Uche Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://thywilluche.com/images/main.jpg"],
    },
    alternates: {
      canonical: "https://thywilluche.com/services",
    },
  };
}

const page = async () => {
  const content = await getServiceSection("overview");
  return (
    <div className="container mx-auto px-4 py-10 space-y-16">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h1
          className={`text-4xl lg:text-5xl xl:text-6xl ${georgiaItalic.className} font-bold text-gray-900`}
        >
          {content.title || "Services"}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {content.subtitle ||
            "Transform your vision into reality with personalized guidance, expert consulting, and professional writing services tailored to your unique journey."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
        <div className="group relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg order-2 lg:order-1">
              <Image
                src={
                  content.coachingImage || "/images/IMG_20240828_162759[1].jpg"
                }
                alt="Coaching services"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2
                  className={`text-3xl md:text-4xl font-bold ${oswald.className} text-gray-900`}
                >
                  {content.coachingTitle || "Coaching"}
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {content.coachingDescription ||
                  "One-on-one personalized coaching sessions designed to help you navigate life's challenges, build resilience, and achieve your personal goals. Together, we'll create a roadmap for your mental wellness and personal growth."}
              </p>
              <ul
                className={`space-y-3 text-muted-foreground ${oswald.className}`}
              >
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Personalized mental wellness strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Goal setting and accountability support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Practical tools for daily resilience</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/services/coaching">
                  <Button variant="outline" className="gap-2">
                    Learn More
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/services/coaching/booking">
                  <Button className="gap-2">
                    Book Session
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 order-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <PenTool className="w-8 h-8 text-primary" />
                </div>
                <h2
                  className={`text-3xl md:text-4xl font-bold ${oswald.className} text-gray-900`}
                >
                  {content.ghostwritingTitle || "Ghostwriting"}
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {content.ghostwritingDescription ||
                  "Bring your story to life with professional ghostwriting services. Whether it's a memoir, self-help book, or personal project, I'll help you craft compelling narratives that resonate with your audience."}
              </p>
              <ul
                className={`space-y-3 text-muted-foreground ${oswald.className}`}
              >
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Memoirs and personal narratives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Self-help and motivational books</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Content editing and manuscript development</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/services/ghostwriting">
                  <Button variant="outline" className="gap-2">
                    Learn More
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/services/ghostwriting/booking">
                  <Button className="gap-2">
                    Get Started
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg order-2">
              <Image
                src={
                  content.ghostwritingImage ||
                  "/images/IMG_20250907_010336[1].jpg"
                }
                alt="Ghostwriting services"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg order-2 lg:order-1">
              <Image
                src={
                  content.consultingImage ||
                  "/images/IMG_20250716_093443[1].jpg"
                }
                alt="Consulting services"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h2
                  className={`text-3xl md:text-4xl font-bold ${oswald.className} text-gray-900`}
                >
                  {content.consultingTitle || "Consulting"}
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {content.consultingDescription ||
                  "Strategic consulting for organizations, content creators, and individuals looking to build authentic mental health initiatives, develop impactful content, or create meaningful community engagement strategies."}
              </p>
              <ul
                className={`space-y-3 text-muted-foreground ${oswald.className}`}
              >
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Mental health advocacy programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Content strategy and brand development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Community building and engagement</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/services/consulting">
                  <Button variant="outline" className="gap-2">
                    Learn More
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/services/consulting/booking">
                  <Button className="gap-2">
                    Book Consultation
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6 max-w-2xl mx-auto pt-8">
        <h3
          className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
        >
          {content.ctaTitle || "Ready to Get Started?"}
        </h3>
        <p className="text-muted-foreground">
          {content.ctaDescription ||
            "Whether you're looking for personal coaching, need help writing your story, or want to build impactful initiatives, I'm here to support your journey."}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/services/consulting/booking">
            <Button size="lg" className="gap-2">
              {content.ctaButtonText || "Book a Consultation"}
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/services/custom">
            <Button size="lg" variant="outline" className="gap-2">
              Custom Request
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
