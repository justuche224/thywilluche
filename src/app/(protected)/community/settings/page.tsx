import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Community | Thywill Uche",
  description: "Community settings and preferences",
};

export default function SettingsPage() {
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
