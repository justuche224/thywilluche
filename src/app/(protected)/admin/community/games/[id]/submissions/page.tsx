import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { getGameById } from "@/actions/community/games";
import SubmissionsReviewer from "@/components/admin/community/submissions-reviewer";

interface GameSubmissionsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: GameSubmissionsPageProps): Promise<Metadata> {
  const session = await serverAuth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      title: "Game Submissions | Admin | Thywill Uche",
    };
  }

  const result = await getGameById({ gameId: params.id });
  const game = result.success ? result.data : null;

  return {
    title: game
      ? `${game.title} - Submissions | Admin | Thywill Uche`
      : "Game Submissions | Admin | Thywill Uche",
    description: "Review and manage game submissions",
  };
}

export default async function GameSubmissionsPage({
  params,
}: GameSubmissionsPageProps) {
  const session = await serverAuth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const result = await getGameById({ gameId: params.id });

  if (!result.success || !result.data) {
    redirect("/admin/community/games");
  }

  const game = result.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
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
          <p className="text-muted-foreground">
            Review submissions and select winners for this game.
          </p>
        </div>

        <SubmissionsReviewer gameId={game.id} gameType={game.type} />
      </div>
    </div>
  );
}
