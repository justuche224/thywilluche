import { getHomeSection } from "@/actions/admin/home-content";
import { getSocials } from "@/actions/contact-info";
import { HeroForm } from "@/components/admin/pages/home/hero-form";
import { WhoIAmForm } from "@/components/admin/pages/home/who-i-am-form";
import { FeaturedForm } from "@/components/admin/pages/home/featured-form";
import { LivePreview } from "@/components/admin/pages/home/live-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const heroData = await getHomeSection("hero");
  const whoIAmData = await getHomeSection("whoIAm");
  const featuredData = await getHomeSection("featured");
  const socials = await getSocials();

  return (
    <div className="p-6 space-y-6 container mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Home Page Content</h1>
        <p className="text-muted-foreground">
          Manage your home page content without code changes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="whoiam">Who I Am</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
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
          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle>Featured Section</CardTitle>
                <CardDescription>
                  Update the Latest Addition / Featured section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeaturedForm data={featuredData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="sticky top-0 h-fit">
          <LivePreview
            initialHeroData={heroData}
            initialWhoIAmData={whoIAmData}
            initialFeaturedData={featuredData}
            initialSocials={socials}
          />
        </div>
      </div>
    </div>
  );
};
export default page;
