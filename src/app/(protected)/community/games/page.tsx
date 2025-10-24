import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import GamesListing from "@/components/community/games/games-listing";

export const metadata: Metadata = {
  title: "Games & Quizzes | Community | Thywill Uche",
  description:
    "Play games and quizzes to test your knowledge and skills while earning rewards.",
};

export default async function GamesPage() {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/games");
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Games & Quizzes</h1>
          <p className="text-muted-foreground">
            Play interactive games, quizzes, and writing challenges to test your
            skills and earn rewards. Compete with others and climb the
            leaderboard!
          </p>
        </div>
        <GamesListing />
      </div>
    </div>
  );
}
