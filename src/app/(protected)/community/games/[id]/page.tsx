import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { getGameById } from "@/actions/community/games";
import GamePlayer from "@/components/community/games/game-player";

interface GamePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const user = await serverAuth();
  if (!user) {
    return {
      title: "Game | Community | Thywill Uche",
    };
  }

  const { id } = await params;
  const result = await getGameById({ gameId: id });
  const game = result.success ? result.data : null;

  return {
    title: game
      ? `${game.title} | Games | Community | Thywill Uche`
      : "Game | Community | Thywill Uche",
    description: game ? game.description : "Play interactive games and quizzes",
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/community/games");
  }

  const { id } = await params;
  const result = await getGameById({ gameId: id });

  if (!result.success || !result.data) {
    redirect("/community/games");
  }

  const game = result.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {game.type === "quiz"
                ? "🧠"
                : game.type === "writing_challenge"
                ? "✍️"
                : "🧩"}
            </span>
            <h1 className="text-3xl font-bold">{game.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{game.description}</p>
        </div>
        {/* @ts-expect-error nothing to fix */}
        <GamePlayer game={game} />
      </div>
    </div>
  );
}
