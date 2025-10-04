import { getHomeSection } from "@/actions/admin/home-content";
import { HeroForm } from "@/components/admin/pages/home/hero-form";
import { WhoIAmForm } from "@/components/admin/pages/home/who-i-am-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = async () => {
  const heroData = await getHomeSection("hero");
  const whoIAmData = await getHomeSection("whoIAm");

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Home Page Content</h1>
        <p className="text-muted-foreground">
          Manage your home page content without code changes
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="whoiam">Who I Am</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Update the hero section content and image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeroForm data={heroData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whoiam">
          <Card>
            <CardHeader>
              <CardTitle>Who I Am Section</CardTitle>
              <CardDescription>
                Update the &ldquo;Who I Am&rdquo; section content and image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WhoIAmForm data={whoIAmData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default page;
