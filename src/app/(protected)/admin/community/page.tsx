import { redirect } from "next/navigation";
import {
  getCommunityStats,
  getRecentActivity,
} from "@/actions/admin/community";
import { CommunityDashboard } from "@/components/admin/community/community-dashboard";
import { requireAdmin } from "@/lib/server-auth";

export default async function CommunityAdminPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const [statsResult, activityResult] = await Promise.all([
    getCommunityStats(),
    getRecentActivity(),
  ]);

  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load community statistics</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CommunityDashboard
        stats={statsResult.data}
        //@ts-expect-error doesn't work break anything
        recentActivity={activityResult.success ? activityResult.data : null}
      />
    </div>
  );
}
