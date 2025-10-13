import React from "react";
import PostDetail from "@/components/community/home/post-detail";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ postID: string }> }) => {
  const { postID } = await params;

  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/home/posts/" + postID);
  }
  return (
    <div className="px-4 py-6">
      <PostDetail postId={postID} />
    </div>
  );
};

export default page;
