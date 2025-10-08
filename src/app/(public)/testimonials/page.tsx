import React from "react";
import Testimonials from "@/components/testimonials";
import { getApprovedTestimonials } from "@/actions/testimonials";

const page = async () => {
  const data = await getApprovedTestimonials();
  return <Testimonials testimonials={data} />;
};

export default page;
