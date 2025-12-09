import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Pattern from "@/components/pattern";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import NextTopLoader from "nextjs-toploader";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
// import { DebugErrorTrigger } from "@/components/debug-error-trigger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thywilluche.com"),
  title: {
    default: "Thywill Uche",
    template: "%s | Thywill Uche",
  },
  description: "365 TIPS, 365 WINS - EVERY DAY IS VICTORY",
  keywords: [
    "Thywill Uche",
    "Thywill Uche's Blog",
    "Thywill Uche's Website",
    "Thywill Uche's Portfolio",
    "Thywill Uche's Projects",
    "Thywill Uche's Achievements",
    "Thywill Uche's Awards",
    "Thywill Uche's Certifications",
    "Thywill Uche's Skills",
    "Thywill Uche's Education",
    "Thywill Uche's Experience",
    "Thywill Uche's References",
    "Thywill Uche's Testimonials",
    "Writer",
    "Author",
    "Podcaster",
    "Coach",
    "Mentor",
    "Speaker",
    "Consultant",
    "Trainer",
    "Motivational Speaker",
    "Life Coach",
    "Business Coach",
    "Career Coach",
    "Ghostwriter",
    "Relationship Coach",
    "Financial Coach",
    "Health Coach",
    "Wellness Coach",
    "Nutrition Coach",
    "Days I Do Not Die",
    "Writer of Days I Do Not Die",
  ],
  authors: [{ name: "Thywill Uche", url: "https://thywilluche.com" }],
  creator: "Thywill Uche",
  publisher: "Thywill Uche",
  category: "personal website",
  applicationName: "Thywill Uche",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thywilluche.com",
    languages: {
      "en-US": "https://thywilluche.com",
      "en-GB": "https://thywilluche.com",
      "en-CA": "https://thywilluche.com",
      "en-AU": "https://thywilluche.com",
      "en-NZ": "https://thywilluche.com",
    },
    media: {
      "image/jpeg": "https://thywilluche.com/images/main.jpg",
      "image/png": "https://thywilluche.com/images/main.png",
      "image/webp": "https://thywilluche.com/images/main.webp",
    },
    types: {
      website: "https://thywilluche.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thywilluche.com",
    siteName: "Thywill Uche",
    title: "Thywill Uche",
    description: "365 TIPS, 365 WINS - EVERY DAY IS VICTORY",
    images: [
      {
        url: "https://thywilluche.com/images/main.jpg",
        width: 1200,
        height: 630,
        alt: "Thywill Uche",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thywill Uche",
    description: "365 TIPS, 365 WINS - EVERY DAY IS VICTORY",
    images: ["https://thywilluche.com/images/main.jpg"],
    creator: "@thywilluche",
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Pattern />
        {/* <DebugErrorTrigger /> */}
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <NextTopLoader color="#800000" />
        <Toaster position={"top-center"} richColors />
        <Link
          href="/support"
          className="fixed bottom-4 right-4 z-50 w-10 h-10 text-wtite bg-primary rounded-full p-2 flex items-center justify-center"
        >
          <MessageCircle className="w-10 h-10" />
        </Link>
      </body>
    </html>
  );
}
