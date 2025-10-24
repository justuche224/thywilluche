import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import GameEditForm from "@/components/admin/community/game-edit-form";

export const metadata: Metadata = {
  title: "Edit Game | Admin | Community | Thywill Uche",
  description: "Edit an existing game, quiz, or challenge.",
};

interface EditGamePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const user = await serverAuth();
  if (!user) {
    redirect("/auth/login?callbackUrl=/admin/community/games");
  }

  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Game</h1>
          <p className="text-muted-foreground">
            Update your game settings, questions, and rewards.
          </p>
        </div>
        <GameEditForm gameId={id} />
      </div>
    </div>
  );
}
