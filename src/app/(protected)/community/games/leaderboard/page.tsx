import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import LeaderboardTable from "@/components/community/games/leaderboard-table";

export const metadata: Metadata = {
  title: "Leaderboard | Games | Community | Thywill Uche",
  description: "See who's leading the games and challenges leaderboard",
};

export default async function LeaderboardPage() {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/games/leaderboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            See who&apos;s leading the community in games, quizzes, and
            challenges. Compete with others and climb to the top!
          </p>
        </div>
        <LeaderboardTable />
      </div>
    </div>
  );
}
