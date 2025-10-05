"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServicesOverviewForm } from "./services-overview-form";
import { CoachingForm } from "./coaching-form";
import { GhostwritingForm } from "./ghostwriting-form";
import { ConsultingForm } from "./consulting-form";
import { ServicesDynamicPreview } from "./services-dynamic-preview";

interface ServicesTabsWrapperProps {
  overviewData: Record<string, string>;
  coachingData: Record<string, string>;
  ghostwritingData: Record<string, string>;
  consultingData: Record<string, string>;
}

export function ServicesTabsWrapper({
  overviewData,
  coachingData,
  ghostwritingData,
  consultingData,
}: ServicesTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
      >
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
      <div className="sticky top-0 h-fit">
        <ServicesDynamicPreview
          activeTab={activeTab}
          initialOverviewData={overviewData}
          initialCoachingData={coachingData}
          initialGhostwritingData={ghostwritingData}
          initialConsultingData={consultingData}
        />
      </div>
    </div>
  );
}
