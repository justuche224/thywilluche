import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { UsersManagement } from "@/components/admin/community/users-management";

export default async function UsersManagementPage() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <UsersManagement />
    </div>
  );
}
