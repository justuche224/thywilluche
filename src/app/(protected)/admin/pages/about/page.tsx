import { getAboutContent } from "@/actions/about-content";
import AboutContentManager from "@/components/admin/about-content-manager";

export default async function AdminAboutPage() {
    const content = await getAboutContent();

    const journeyData = content.journey || {};
    const missionVisionData = content.missionVision || {};

    return (
        <div className="container mx-auto p-6">
            <AboutContentManager
                initialData={{
                    journey: journeyData,
                    missionVision: missionVisionData,
                }}
            />
        </div>
    );
}
