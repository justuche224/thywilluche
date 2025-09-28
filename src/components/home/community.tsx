import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Heart, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

const Community = () => {
  return (
    <div className="w-full relative py-20 lg:py-24">
      <Image
        src="/images/community.jpg"
        alt="Community background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 bg-black/40 -z-5"></div>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-5xl lg:text-6xl ${pacifico.className} mb-6 text-white`}
            >
              Join Our Community
            </h2>
            <p
              className={`text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed ${oswald.className}`}
            >
              Connect with like-minded individuals on a journey of growth,
              healing, and daily victories. Share your story, find support, and
              discover strength in numbers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/70 rounded-2xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${oswald.className}`}>
                Supportive Network
              </h3>
              <p
                className={`text-gray-700 leading-relaxed ${oswald.className}`}
              >
                Connect with others who understand your journey and share
                similar experiences of growth and resilience.
              </p>
            </div>

            <div className="bg-white/70 rounded-2xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${oswald.className}`}>
                Daily Inspiration
              </h3>
              <p
                className={`text-gray-700 leading-relaxed ${oswald.className}`}
              >
                Receive daily tips, motivational content, and stories that
                remind you that every day is a victory worth celebrating.
              </p>
            </div>

            <div className="bg-white/70 rounded-2xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${oswald.className}`}>
                Meaningful Conversations
              </h3>
              <p
                className={`text-gray-700 leading-relaxed ${oswald.className}`}
              >
                Engage in thoughtful discussions about mental health, personal
                growth, and the power of daily victories.
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-3xl p-8 lg:p-12 text-center shadow-xl backdrop-blur-sm border border-white/50">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3
              className={`text-3xl lg:text-4xl font-semibold mb-6 ${oswald.className} text-black`}
            >
              Ready to Begin Your Journey?
            </h3>
            <p
              className={`text-lg lg:text-xl text-black/90 mb-8 max-w-2xl mx-auto leading-relaxed ${oswald.className}`}
            >
              Join thousands of individuals who are transforming their lives one
              day at a time. Your story matters, and your victory is worth
              sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className={`px-8 py-6 text-lg ${oswald.className} bg-primary hover:bg-primary/90`}
              >
                <Link href="#">Join Community</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg ${oswald.className} border-2`}
              >
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
