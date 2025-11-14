import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import BadgesManagement from "@/components/admin/community/badges-management";

export const metadata: Metadata = {
  title: "Badges Management | Admin | Thywill Uche",
  description: "Manage badges and achievements",
};

export default async function AdminBadgesPage() {
  const session = await serverAuth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Badges Management</h1>
          <p className="text-muted-foreground">
            Create and manage badges that users can earn through games and
            challenges.
          </p>
        </div>
        <BadgesManagement />
      </div>
    </div>
  );
}
