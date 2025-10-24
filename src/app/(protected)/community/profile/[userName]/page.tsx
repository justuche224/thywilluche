import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import db from "@/db";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import Posts from "@/components/community/home/posts";
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

const page = async ({ params }: { params: Promise<{ userName: string }> }) => {
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

  if (!userProfile[0]) {
    redirect("/community");
  }

  const bio = userProfile[0]?.bio || "No bio available";

  // Fetch user badges, points, and rank
  const badgesResult = await getUserBadges({ userId: userProfile[0].id });
  const userBadges = badgesResult.success ? badgesResult.data : [];

  const pointsResult = await getUserPoints({ userId: userProfile[0].id });
  const userPoints = pointsResult.success
    ? pointsResult.data
    : { totalPoints: 0 };

  const rankResult = await getUserRank({ userId: userProfile[0].id });
  const userRank = rankResult.success
    ? rankResult.data
    : { rank: null, totalPoints: 0, totalWins: 0, totalParticipation: 0 };

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
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">{userProfile[0]?.name}</h1>
            <BadgeDisplay
              // @ts-expect-error nothing
              badges={userBadges?.map((badge) => badge.badge) || []}
              maxDisplay={3}
              size="sm"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#800000]">
            @{userProfile[0]?.displayUsername || userProfile[0]?.username}
          </h2>
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
        displayName={
          userProfile[0]?.displayUsername ||
          userProfile[0]?.username ||
          userProfile[0]?.name ||
          ""
        }
        showNewButton={false}
        userId={userProfile[0]?.id}
      />
    </div>
  );
};

export default page;
