import React from "react";
import ProjectDetail from "@/components/portfolio/project-detail";
import { getPublicProjectById } from "@/actions/projects";

const page = async ({ params }: { params: { id: string } }) => {
  const project = await getPublicProjectById(params.id);

  return <ProjectDetail project={project} />;
};

export default page;
