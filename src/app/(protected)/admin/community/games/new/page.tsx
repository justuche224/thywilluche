import { Metadata } from "next";
import { redirect } from "next/navigation";
import GameForm from "@/components/admin/community/game-form";
import { requireAdmin } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Create New Game | Admin | Community | Thywill Uche",
  description: "Create a new game, quiz, or challenge for the community.",
};

export default async function NewGamePage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
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
