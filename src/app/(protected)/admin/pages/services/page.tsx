import { getServiceSection } from "@/actions/admin/services-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServicesOverviewForm } from "@/components/admin/pages/services/services-overview-form";
import { CoachingForm } from "@/components/admin/pages/services/coaching-form";
import { GhostwritingForm } from "@/components/admin/pages/services/ghostwriting-form";
import { ConsultingForm } from "@/components/admin/pages/services/consulting-form";

const page = async () => {
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
          <TabsTrigger value="ghostwriting">Ghostwriting</TabsTrigger>
          <TabsTrigger value="consulting">Consulting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Services Overview</CardTitle>
              <CardDescription>
                Update the main services page content and service descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServicesOverviewForm data={overviewData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coaching">
          <Card>
            <CardHeader>
              <CardTitle>Coaching Service</CardTitle>
              <CardDescription>
                Update the coaching service page content and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CoachingForm data={coachingData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ghostwriting">
          <Card>
            <CardHeader>
              <CardTitle>Ghostwriting Service</CardTitle>
              <CardDescription>
                Update the ghostwriting service page content and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GhostwritingForm data={ghostwritingData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consulting">
          <Card>
            <CardHeader>
              <CardTitle>Consulting Service</CardTitle>
              <CardDescription>
                Update the consulting service page content and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultingForm data={consultingData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
