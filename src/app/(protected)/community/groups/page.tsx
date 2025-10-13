import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groups | Community | Thywill Uche",
  description: "Browse and join community groups",
};

export default function GroupsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Community Groups</h1>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Groups Page Coming Soon
          </h2>
          <p className="text-muted-foreground">
            This page will allow you to browse and join different community
            groups.
          </p>
        </div>
      </div>
    </div>
  );
}
