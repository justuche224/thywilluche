import React from "react";
import NGO from "@/components/ngo";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thywill Fountain of Hope",
  description:
    "We are dedicated to empowering communities through education, healthcare, and sustainable development initiatives. Our mission is to create lasting positive change by addressing the root causes of poverty and inequality.",
  icons: {
    icon: "/logos/NGO.png",
  },
};

const page = async () => {
  return (
    <>
      <Head>
        <title>Thywill Fountain of Hope</title>
        <link rel="icon" href="/logos/NGO.png" sizes="any" />
      </Head>
      <NGO />
    </>
  );
};

export default page;
