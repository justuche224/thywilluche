import CommunityHome from "@/components/community/home";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/home");
  }
  return (
    <div className="px-4 min-h-screen">
      <CommunityHome />
    </div>
  );
};

export default page;
