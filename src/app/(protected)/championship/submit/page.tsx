import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import {
  checkChampionshipRegistration,
  getReviewSubmission,
} from "@/actions/championship";
import Submit from "@/components/championship/submit";

export const metadata: Metadata = {
  title: "Championship Submit Review | Thywill Uche",
  description:
    "Submit your review for the Thywill's Book Review Champion's League",
  openGraph: {
    title: "Championship Submit Review | Thywill Uche",
    description:
      "Submit your review for the Thywill's Book Review Champion's League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Championship Submit Review | Thywill Uche",
    description:
      "Submit your review for the Thywill's Book Review Champion's League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
};

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/championship/submit");
  }

  const registrationCheck = await checkChampionshipRegistration();

  if (!registrationCheck.success || !registrationCheck.registered) {
    return redirect("/championship/registration");
  }

  if (registrationCheck.status !== "approved") {
    return redirect("/championship/registration");
  }

  const submissionCheck = await getReviewSubmission();

  return <Submit submission={submissionCheck.submission} />;
};

export default page;
