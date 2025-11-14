import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings | Community | Thywill Uche",
  description: "Community settings and preferences",
};

export default async function SettingsPage() {
  const session = await serverAuth();
  if (!session) {
    redirect("/auth/login?callbackUrl=/community/settings");
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Community Settings</h1>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Settings Page Coming Soon
          </h2>
          <p className="text-muted-foreground">
            This page will allow you to manage your community preferences and
            settings.
          </p>
        </div>
      </div>
    </div>
  );
}
