import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import GameForm from "@/components/admin/community/game-form";

export const metadata: Metadata = {
  title: "Create New Game | Admin | Community | Thywill Uche",
  description: "Create a new game, quiz, or challenge for the community.",
};

export default async function NewGamePage() {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/admin/community/games/new");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Game</h1>
          <p className="text-muted-foreground">
            Create a new game, quiz, or writing challenge for the community.
          </p>
        </div>
        <GameForm />
      </div>
    </div>
  );
}
