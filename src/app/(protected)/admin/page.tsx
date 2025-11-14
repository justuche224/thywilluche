import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/admin/dashboard";
import { AdminDashboard } from "@/components/admin/dashboard/admin-dashboard";

export default async function AdminPage() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }

  const statsResult = await getDashboardStats();

  if (!statsResult.success || !statsResult.stats) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminDashboard stats={statsResult.stats} />
    </div>
  );
}
