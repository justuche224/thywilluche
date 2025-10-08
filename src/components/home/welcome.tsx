import Image from "next/image";
import React from "react";
import { Oswald } from "next/font/google";
import { georgiaItalic } from "@/utils/georgia-italic";
import { Button } from "../ui/button";
import {
  Facebook,
  Instagram,
  X,
  Youtube,
  LucideIcon,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  x: X,
  youtube: Youtube,
  linkedin: Linkedin,
};

const Welcome = ({
  setShowWelcome,
  socials,
}: {
  setShowWelcome: (show: boolean) => void;
  socials: {
    key: string;
    label: string;
    url: string;
  }[];
}) => {
  return (
    <div
      style={{
        backgroundImage: `url('/images/welcome.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100svh",
        width: "100%",
        zIndex: 1000,
      }}
      className="fixed top-0 left-0 w-full h-full gird grid-cols-1 md:grid-cols-2"
    >
      <div className="w-full h-full md:w-1/3 flex-col flex justify-center items-center gap-4">
        <Image
          src="/images/phoenix-bird.png"
          alt="welcome"
          width={100}
          height={100}
        />
        <div className="text-center">
          <h1 className={`text-4xl font-bold ${oswald.className}`}>
            Thywill Uche
          </h1>
          <p className={`${georgiaItalic.className} text-lg`}>
            Crazy or genius? You be the judge.
          </p>
        </div>
        <Button onClick={() => setShowWelcome(false)}>ENTER SITE</Button>
        <div className="flex space-x-3">
          {socials.map((social) => {
            const IconComponent = iconMap[social.key.toLowerCase()];
            return (
              <Button
                key={social.key}
                size="icon"
                asChild
                className="h-10 w-10 border-gray-700 hover:border-primary hover:bg-primary/10 bg-[#800000]"
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {IconComponent ? (
                    <IconComponent className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </Link>
              </Button>
            );
          })}
          <Button
            size={"icon"}
            asChild
            className="h-10 w-10 border-gray-700 hover:border-primary hover:bg-primary/10 bg-[#800000]"
          >
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={
                "https://www.linkedin.com/in/thywill-uche-551680273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              }
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full h-full md:w-2/3"></div>
    </div>
  );
};

export default Welcome;
