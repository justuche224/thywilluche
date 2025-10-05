import React from "react";
import ConsultingPage from "@/components/services/consulting";
import { getServiceSection } from "@/actions/services-content";

const page = async () => {
  const content = await getServiceSection("consulting");
  return <ConsultingPage content={content} />;
};

export default page;
