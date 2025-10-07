import { getAllProjects } from "@/actions/admin/projects";
import { ProjectsList } from "@/components/admin/projects/projects-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectsPage() {
  const result = await getAllProjects();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and gallery
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">Create New Project</Link>
        </Button>
      </div>

      <ProjectsList projects={result.projects || []} />
    </div>
  );
}
