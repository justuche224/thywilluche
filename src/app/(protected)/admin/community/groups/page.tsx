import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { GroupsManagement } from "@/components/admin/community/groups-management";

export default async function GroupsManagementPage() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <GroupsManagement />
    </div>
  );
}
