import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import db from "@/db";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import Posts from "@/components/community/home/posts";

const page = async ({params}: { params: Promise<{ userName: string }> }) => {
  const { userName } = await params;

  const session = await serverAuth();

  if (!session) {
    redirect("/auth/login?callbackUrl=/community/profile/" + userName);
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userProfile = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      displayUsername: user.displayUsername,
      bio: user.bio,
    })
    .from(user)
    .where(eq(user.username, userName))
    .limit(1);

  const bio = userProfile[0]?.bio || "No bio available";

  return (
    <div className="container max-w-6xl bg-white rounded-xl mx-auto px-4 py-8 w-full">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
        <Avatar className="h-30 w-30">
          <AvatarImage
            src={userProfile[0]?.image || ""}
            alt={userProfile[0]?.name || ""}
          />
          <AvatarFallback className="bg-[#800000] text-white">
            {userProfile[0]?.name ? getInitials(userProfile[0]?.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">{userProfile[0]?.name}</h1>
          <h2 className="text-2xl font-bold text-[#800000]">
            @{userProfile[0]?.displayUsername || userProfile[0]?.username}
          </h2>
          <p className="text-base text-gray-500 text-center max-w-md">{bio}</p>
        </div>
      </div>
      <Posts
        displayName={
          userProfile[0]?.displayUsername || userProfile[0]?.username || userProfile[0]?.name || ""
        }
        showNewButton={false}
        userId={userProfile[0]?.id}
      />
    </div>
  );
};

export default page;
