import React from "react";
import CoachingPage from "@/components/services/coaching";
import { getServiceSection } from "@/actions/services-content";

const page = async () => {
  const content = await getServiceSection("coaching");
  return <CoachingPage content={content} />;
};

export default page;
