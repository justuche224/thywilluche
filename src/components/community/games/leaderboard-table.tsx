"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard, getUserRank } from "@/actions/community/games";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Users,
  Target,
  Calendar,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  totalWins: number;
  totalParticipation: number;
  rank: number | null;
  lastActivityAt: Date | null;
  user: {
    id: string;
    name: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
  } | null;
}

export default function LeaderboardTable() {
  const [timeframe, setTimeframe] = useState<"all" | "monthly" | "weekly">(
    "all"
  );
  const { data: session } = authClient.useSession();

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: ["leaderboard", timeframe],
    queryFn: () => getLeaderboard({ limit: 50, timeframe }),
  });

  const { data: userRankData } = useQuery({
    queryKey: ["user-rank", session?.user?.id],
    queryFn: () => getUserRank({ userId: session?.user?.id || "" }),
    enabled: !!session?.user?.id,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-4 w-4 text-muted-foreground" />;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-300";
    if (rank <= 10) return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (leaderboardError) {
    toast.error("Failed to load leaderboard");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load leaderboard</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Rank Card */}
      {userRankData?.data && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userRankData.data.rank
                    ? `#${userRankData.data.rank}`
                    : "Unranked"}
                </div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userRankData.data.totalPoints}
                </div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userRankData.data.totalWins}
                </div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userRankData.data.totalParticipation}
                </div>
                <div className="text-sm text-muted-foreground">
                  Games Played
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
          <CardDescription>
            Top performers in games and challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Select
              value={timeframe}
              onValueChange={(value: "all" | "monthly" | "weekly") =>
                setTimeframe(value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {leaderboardData?.data && (
                <>Showing top {leaderboardData.data.length} players</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card>
        <CardContent className="p-0">
          {leaderboardLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="ml-auto space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : leaderboardData?.data && leaderboardData.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Wins</TableHead>
                  <TableHead className="text-center">Games</TableHead>
                  <TableHead className="text-center">Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.data.map((entry: LeaderboardEntry) => (
                  <TableRow
                    key={entry.userId}
                    className={
                      session?.user?.id === entry.userId ? "bg-blue-50" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank ?? 0)}
                        <Badge
                          className={`${getRankBadgeColor(
                            entry.rank ?? 0
                          )} font-bold`}
                        >
                          #{entry.rank ?? "-"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={entry.user?.image || ""}
                            alt={entry.user?.name || "User"}
                          />
                          <AvatarFallback className="bg-[#800000] text-white">
                            {getInitials(entry.user?.name || "U U")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {entry.user?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @
                            {entry.user?.displayUsername ||
                              entry.user?.username ||
                              "user"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-bold text-lg">
                        {entry.totalPoints}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{entry.totalWins}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.totalParticipation}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.lastActivityAt ? (
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.lastActivityAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-10 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">No rankings yet</h3>
              <p className="text-muted-foreground">
                Be the first to participate in games and climb the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      {leaderboardData?.data && leaderboardData.data.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🏆 Top 3 Players 🏆</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end gap-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Medal className="h-8 w-8 text-gray-400" />
                </div>
                <div className="font-semibold">#{2}</div>
                <div className="text-sm text-muted-foreground">
                  {leaderboardData.data[1]?.user?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {leaderboardData.data[1]?.totalPoints} pts
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                  <Crown className="h-10 w-10 text-yellow-500" />
                </div>
                <div className="font-bold text-lg">#{1}</div>
                <div className="font-semibold">
                  {leaderboardData.data[0]?.user?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {leaderboardData.data[0]?.totalPoints} pts
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <div className="font-semibold">#{3}</div>
                <div className="text-sm text-muted-foreground">
                  {leaderboardData.data[2]?.user?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {leaderboardData.data[2]?.totalPoints} pts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
