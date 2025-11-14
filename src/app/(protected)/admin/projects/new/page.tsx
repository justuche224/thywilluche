import { ProjectForm } from "@/components/admin/projects/project-form";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Add a new project to your portfolio
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
