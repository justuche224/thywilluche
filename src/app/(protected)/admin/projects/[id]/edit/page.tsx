import { getProjectById } from "@/actions/admin/projects";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const { id } = await params;
  const result = await getProjectById(id);

  if (!result.success || !result.project) {
    redirect("/admin/projects");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">
          Update project details and content
        </p>
      </div>

      <ProjectForm project={result.project} />
    </div>
  );
}
