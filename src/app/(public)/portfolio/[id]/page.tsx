import React from "react";
import ProjectDetail from "@/components/portfolio/project-detail";

const page = ({ params }: { params: { id: string } }) => {
  return <ProjectDetail projectId={params.id} />;
};

export default page;
