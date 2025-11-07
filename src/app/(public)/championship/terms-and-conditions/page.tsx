import React from "react";
import { Metadata } from "next";
import TermsAndConditions from "@/components/championship/terms-and-conditions";

export const metadata: Metadata = {
  title: "Terms and Conditions | Thywill Uche",
  description:
    "Terms and Conditions for Thywill's Book Review Champions League",
  openGraph: {
    title: "Terms and Conditions | Thywill Uche",
    description:
      "Terms and Conditions for Thywill's Book Review Champions League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Thywill Uche",
    description:
      "Terms and Conditions for Thywill's Book Review Champions League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
};

const page = () => {
  return <TermsAndConditions />;
};

export default page;
