import { serverAuth } from "@/lib/server-auth";
import React from "react";
import { redirect } from "next/navigation";
import MediaHighlightsManager from "@/components/admin/media-highlights-manager";
import { getAllMediaHighlights } from "@/actions/admin/media-highlights";

const page = async () => {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    redirect("/");
  }

  const mediaHighlightsResult = await getAllMediaHighlights();
  const mediaHighlights = mediaHighlightsResult.success
    ? mediaHighlightsResult.data || []
    : [];

  return (
    <div className="container mx-auto px-6 py-8">
      <MediaHighlightsManager initialHighlights={mediaHighlights} />
    </div>
  );
};

export default page;
