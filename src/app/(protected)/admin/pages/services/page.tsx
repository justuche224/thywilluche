import { getServiceSection } from "@/actions/admin/services-content";
import { ServicesTabsWrapper } from "@/components/admin/pages/services/services-tabs-wrapper";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const overviewData = await getServiceSection("overview");
  const coachingData = await getServiceSection("coaching");
  const ghostwritingData = await getServiceSection("ghostwriting");
  const consultingData = await getServiceSection("consulting");

  return (
    <div className="p-6 space-y-6 container mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Services Content</h1>
        <p className="text-muted-foreground">
          Manage your services page content without code changes
        </p>
      </div>

      <ServicesTabsWrapper
        overviewData={overviewData}
        coachingData={coachingData}
        ghostwritingData={ghostwritingData}
        consultingData={consultingData}
      />
    </div>
  );
};

export default page;
