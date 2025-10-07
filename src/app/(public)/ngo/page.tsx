import React from "react";
import NGO from "@/components/ngo";
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
  return <NGO />;
};

export default page;
