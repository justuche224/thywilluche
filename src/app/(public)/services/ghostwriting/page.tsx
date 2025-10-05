import React from "react";
import GhostwritingPage from "@/components/services/ghostwriting";
import { getServiceSection } from "@/actions/services-content";

const page = async () => {
  const content = await getServiceSection("ghostwriting");
  return <GhostwritingPage content={content} />;
};

export default page;
