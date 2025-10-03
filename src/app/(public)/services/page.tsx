import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, PenTool, ArrowRight } from "lucide-react";
import { Pacifico, Oswald } from "next/font/google";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const page = () => {
  return (
    <div className="container mx-auto px-4 py-10 space-y-16">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h1
          className={`text-4xl lg:text-5xl xl:text-6xl ${pacifico.className} font-bold text-gray-900`}
        >
          Services
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Transform your vision into reality with personalized guidance, expert
          consulting, and professional writing services tailored to your unique
          journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
        <div className="group relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg order-2 lg:order-1">
              <Image
                src="/images/IMG_20240828_162759[1].jpg"
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
                  Coaching
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                One-on-one personalized coaching sessions designed to help you
                navigate life&apos;s challenges, build resilience, and achieve
                your personal goals. Together, we&apos;ll create a roadmap for
                your mental wellness and personal growth.
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
              <Link href="/services/coaching">
                <Button className="gap-2 mt-4">
                  Learn More
                  <ArrowRight size={16} />
                </Button>
              </Link>
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
                  Ghostwriting
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bring your story to life with professional ghostwriting
                services. Whether it&apos;s a memoir, self-help book, or
                personal project, I&apos;ll help you craft compelling narratives
                that resonate with your audience.
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
              <Link href="/services/ghostwriting">
                <Button className="gap-2 mt-4">
                  Learn More
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg order-2">
              <Image
                src="/images/IMG_20250907_010336[1].jpg"
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
                src="/images/IMG_20250716_093443[1].jpg"
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
                  Consulting
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Strategic consulting for organizations, content creators, and
                individuals looking to build authentic mental health
                initiatives, develop impactful content, or create meaningful
                community engagement strategies.
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
              <Link href="/services/consulting">
                <Button className="gap-2 mt-4">
                  Learn More
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6 max-w-2xl mx-auto pt-8">
        <h3
          className={`text-2xl md:text-3xl font-bold ${oswald.className} text-gray-900`}
        >
          Ready to Get Started?
        </h3>
        <p className="text-muted-foreground">
          Whether you&apos;re looking for personal coaching, need help writing
          your story, or want to build impactful initiatives, I&apos;m here to
          support your journey.
        </p>
        <Button size="lg" className="gap-2">
          Book a Consultation
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default page;
