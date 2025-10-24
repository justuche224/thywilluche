import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Pattern from "@/components/pattern";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import NextTopLoader from "nextjs-toploader";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thywill Uche",
  description: "365 TIPS, 365 WINS - EVERY DAY IS VICTORY",
  openGraph: {
    title: "Thywill Uche",
    description: "365 TIPS, 365 WINS - EVERY DAY IS VICTORY",
    images: "/images/main.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thywill Uche",
    description: "365 TIPS, 365 WINS - EVERY DAY IS VICTORY",
    images: "/images/main.jpg",
  },
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
