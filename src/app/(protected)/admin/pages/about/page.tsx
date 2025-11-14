import { getAboutContent } from "@/actions/about-content";
import AboutContentManager from "@/components/admin/about-content-manager";
import { AboutLivePreview } from "@/components/admin/about-live-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminAboutPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const content = await getAboutContent();

  const whoIAmData = content.whoIAm || {};
  const journeyData = content.journey || {};
  const purposeData = content.purpose || {};
  const missionVisionData = content.missionVision || {};

  return (
    <div className="p-6 space-y-6 container mx-auto">
      <div>
        <h1 className="text-3xl font-bold">About Page Content</h1>
        <p className="text-muted-foreground">
          Manage your about page content without code changes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>About Content Manager</CardTitle>
              <CardDescription>
                Update the about page content including journey and mission &
                vision sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AboutContentManager
                initialData={{
                  whoIAm: whoIAmData,
                  journey: journeyData,
                  purpose: purposeData,
                  missionVision: missionVisionData,
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="sticky top-0 h-fit">
          <AboutLivePreview
            initialWhoIAmData={whoIAmData}
            initialJourneyData={journeyData}
            initialPurposeData={purposeData}
            initialMissionVisionData={missionVisionData}
          />
        </div>
      </div>
    </div>
  );
}
