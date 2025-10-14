import Posts from "@/components/community/home/posts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { serverAuth } from "@/lib/server-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import EditProfile from "./edit-profile";
import { getUserProfile } from "@/actions/user";

export const metadata: Metadata = {
  title: "Profile | Community | Thywill Uche",
  description: "Your community profile",
};

export default async function ProfilePage() {
  const session = await serverAuth();
  if (!session) {
    redirect("/auth/login?callbackUrl=/community/home");
  }

  const profileResult = await getUserProfile(session.user.id);
  const userProfile = profileResult.success ? profileResult.data : null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName =
    userProfile?.displayUsername ||
    userProfile?.username ||
    session?.user?.name;
  const bio = userProfile?.bio || "No bio available";

  return (
    <div className="container max-w-6xl bg-white rounded-xl mx-auto px-4 py-8 w-full">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
        <Avatar className="h-30 w-30">
          <AvatarImage
            src={userProfile?.image || session?.user?.image || ""}
            alt={session?.user?.name || ""}
          />
          <AvatarFallback className="bg-[#800000] text-white">
            {session?.user?.name ? getInitials(session?.user?.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">{displayName}</h1>
          <p className="text-base text-gray-500 italic">
            {session?.user?.email}
          </p>
          <p className="text-base text-gray-500 text-center max-w-md">{bio}</p>
          <EditProfile userId={session?.user?.id} />
        </div>
      </div>
      <Posts displayName={displayName} showNewButton={false} userId={session?.user?.id} />
    </div>
  );
}
