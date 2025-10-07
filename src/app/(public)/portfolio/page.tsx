import React from "react";
import PortfolioPage from "@/components/portfolio";
import { getPublicProjects } from "@/actions/projects";

const page = async () => {
  const projects = await getPublicProjects();

  return <PortfolioPage projects={projects} />;
};

export default page;
