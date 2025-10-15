import { Metadata } from "next";
import { GroupsListing } from "@/components/community/groups";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Groups | Community | Thywill Uche",
  description: "Browse and join community groups",
};

export default async function GroupsPage() {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/groups");
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Groups</h1>
          <p className="text-muted-foreground">
            Discover and join groups that interest you. Connect with like-minded
            people and participate in discussions.
          </p>
        </div>
        <GroupsListing />
      </div>
    </div>
  );
}
