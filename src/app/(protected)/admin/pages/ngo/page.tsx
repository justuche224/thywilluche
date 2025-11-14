import { getNgoContent } from "@/actions/ngo-content";
import NgoContentManager from "@/components/admin/ngo-content-manager";
import { NgoLivePreview } from "@/components/admin/ngo-live-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminNgoPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const content = await getNgoContent();

  const heroData = content.hero || {};
  const missionData = content.mission || {};
  const visionData = content.vision || {};
  const programsData = content.programs || {};
  const educationData = content.education || {};
  const healthcareData = content.healthcare || {};
  const developmentData = content.development || {};
  const impactData = content.impact || {};
  const ctaData = content.cta || {};

  return (
    <div className="p-6 space-y-6 container mx-auto">
      <div>
        <h1 className="text-3xl font-bold">NGO Page Content</h1>
        <p className="text-muted-foreground">
          Manage your NGO page content without code changes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>NGO Content Manager</CardTitle>
              <CardDescription>
                Update the NGO page content including hero, mission, vision,
                programs, impact, and call-to-action sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NgoContentManager
                initialData={{
                  hero: heroData,
                  mission: missionData,
                  vision: visionData,
                  programs: programsData,
                  education: educationData,
                  healthcare: healthcareData,
                  development: developmentData,
                  impact: impactData,
                  cta: ctaData,
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="sticky top-0 h-fit">
          <NgoLivePreview
            initialHeroData={heroData}
            initialMissionData={missionData}
            initialVisionData={visionData}
            initialProgramsData={programsData}
            initialEducationData={educationData}
            initialHealthcareData={healthcareData}
            initialDevelopmentData={developmentData}
            initialImpactData={impactData}
            initialCtaData={ctaData}
          />
        </div>
      </div>
    </div>
  );
}
