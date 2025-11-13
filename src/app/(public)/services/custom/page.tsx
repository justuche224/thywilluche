import React from "react";
import { BookingForm } from "@/components/services/booking-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Request | Services | Thywill Uche",
  description:
    "Have a unique project or service need? Contact Thywill Uche for custom coaching, consulting, writing, or other personalized services tailored to your specific requirements.",
  keywords: [
    "custom services",
    "personalized services",
    "custom coaching",
    "custom consulting",
    "custom writing",
    "bespoke services",
    "Thywill Uche custom services",
    "tailored services",
  ],
  openGraph: {
    title: "Custom Request | Services | Thywill Uche",
    description:
      "Have a unique project or service need? Contact Thywill Uche for custom coaching, consulting, writing, or other personalized services tailored to your specific requirements.",
    url: "https://thywilluche.com/services/custom",
    siteName: "Thywill Uche",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://thywilluche.com/images/main.jpg",
        width: 1200,
        height: 630,
        alt: "Custom Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Request | Services | Thywill Uche",
    description:
      "Have a unique project or service need? Contact Thywill Uche for custom services.",
    images: ["https://thywilluche.com/images/main.jpg"],
  },
  alternates: {
    canonical: "https://thywilluche.com/services/custom",
  },
};

const CustomRequestPage = () => {
  return (
    <div className="min-h-screen py-12">
      <BookingForm serviceType="custom" serviceName="Custom Request" />
    </div>
  );
};

export default CustomRequestPage;
