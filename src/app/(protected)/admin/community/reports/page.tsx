import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { ReportsManagement } from "@/components/admin/community/reports-management";

export default async function ReportsPage() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ReportsManagement />
    </div>
  );
}
