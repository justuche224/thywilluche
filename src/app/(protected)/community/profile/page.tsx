import Posts from "@/components/community/home/posts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { serverAuth } from "@/lib/server-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import EditProfile from "./edit-profile";
import { getUserProfile } from "@/actions/user";
import {
  getUserBadges,
  getUserPoints,
  getUserRank,
} from "@/actions/community/games";
import BadgeDisplay from "@/components/shared/badge-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile | Community | Thywill Uche",
  description: "Your community profile",
};

export default async function ProfilePage() {
  const session = await serverAuth();
  if (!session) {
    redirect("/auth/login?callbackUrl=/community/profile");
  }

  const profileResult = await getUserProfile(session.user.id);
  const userProfile = profileResult.success ? profileResult.data : null;

  const badgesResult = await getUserBadges({ userId: session.user.id });
  const userBadges = badgesResult.success ? badgesResult.data : [];

  const pointsResult = await getUserPoints({ userId: session.user.id });
  const userPoints = pointsResult.success
    ? pointsResult.data
    : { totalPoints: 0 };

  const rankResult = await getUserRank({ userId: session.user.id });
  const userRank = rankResult.success
    ? rankResult.data
    : { rank: null, totalPoints: 0, totalWins: 0, totalParticipation: 0 };

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
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">{displayName}</h1>
            <BadgeDisplay
            // @ts-expect-error nothing
              badges={userBadges?.map((badge) => badge.badge) || []}
              maxDisplay={3}
              size="sm"
            />
          </div>
          <p className="text-base text-gray-500 italic">
            {session?.user?.email}
          </p>
          <p className="text-base text-gray-500 text-center max-w-md">{bio}</p>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userRank?.rank ? `#${userRank?.rank}` : "Unranked"}
              </div>
              <div className="text-xs text-gray-500">Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {userPoints?.totalPoints}
              </div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userRank?.totalWins}</div>
              <div className="text-xs text-gray-500">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {userRank?.totalParticipation}
              </div>
              <div className="text-xs text-gray-500">Games</div>
            </div>
          </div>

          <EditProfile userId={session?.user?.id} />
        </div>
      </div>

      {/* Badges Section */}
      {userBadges && userBadges.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Badges ({userBadges.length})
            </CardTitle>
            <CardDescription>
              Achievements earned through games and challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userBadges.map((userBadge) => {
                const badge = userBadge.badge;
                const getRarityColor = (rarity: string) => {
                  switch (rarity) {
                    case "common":
                      return "border-gray-300";
                    case "rare":
                      return "border-blue-300";
                    case "epic":
                      return "border-purple-300";
                    case "legendary":
                      return "border-yellow-300";
                    default:
                      return "border-gray-300";
                  }
                };

                return (
                  <div
                    key={userBadge.id}
                    className={`p-4 rounded-lg border-2 ${getRarityColor(
                      badge?.rarity || "common"
                    )} bg-white hover:shadow-md transition-shadow cursor-pointer`}
                    title={`${badge?.name} - ${badge?.description}`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{badge?.icon}</div>
                      <div className="text-sm font-medium truncate">
                        {badge?.name}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-1 capitalize ${
                          badge?.rarity === "legendary"
                            ? "bg-yellow-50 text-yellow-700"
                            : badge?.rarity === "epic"
                            ? "bg-purple-50 text-purple-700"
                            : badge?.rarity === "rare"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {badge?.rarity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Posts
        displayName={displayName}
        showNewButton={false}
        userId={session?.user?.id}
      />
    </div>
  );
}
