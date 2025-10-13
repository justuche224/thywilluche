import NewPost from "@/components/community/home/new-post";
import { serverAuth } from "@/lib/server-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Create New Post | Community | Thywill Uche",
  description: "Share your thoughts, ideas, and experiences with the community.",
};

const page = async () => {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/home/posts/new");
  }
  return (
    <div className="px-4 min-h-screen">
      <NewPost />
    </div>
  );
};

export default page;
