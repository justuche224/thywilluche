import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import Registration from "@/components/championship/registration";
import RegistrationInfo from "@/components/championship/registration-info";
import { checkChampionshipRegistration } from "@/actions/championship";

export const metadata: Metadata = {
  title: "Championship Registration | Thywill Uche",
  description: "Register for the Thywill's Book Review Champion's League",
  openGraph: {
    title: "Championship Registration | Thywill Uche",
    description: "Register for the Thywill's Book Review Champion's League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Championship Registration | Thywill Uche",
    description: "Register for the Thywill's Book Review Champion's League",
    images: "/images/IMG_20250907_010336[1].jpg",
  },
};

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/championship/registration");
  }

  const registrationCheck = await checkChampionshipRegistration();

  const userData = {
    id: user.session.id,
    createdAt: user.session.createdAt,
    updatedAt: user.session.updatedAt,
    email: user.user.email,
    emailVerified: user.user.emailVerified,
    name: user.user.name,
    image: user.user.image,
    username: user.user.username || "",
  };

  if (registrationCheck.success && registrationCheck.registered) {
    return (
      <RegistrationInfo
        user={userData}
        registration={registrationCheck.data!}
        status={registrationCheck.status!}
      />
    );
  }

  return <Registration user={userData} />;
};

export default page;
