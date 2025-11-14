import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { AnnouncementsManagement } from "@/components/admin/community/announcements-management";

export default async function AnnouncementsManagementPage() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AnnouncementsManagement />
    </div>
  );
}
