import { Metadata } from "next";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import GamesManagement from "@/components/admin/community/games-management";

export const metadata: Metadata = {
  title: "Games Management | Admin | Thywill Uche",
  description: "Manage games, quizzes, and challenges",
};

export default async function AdminGamesPage() {
  const session = await serverAuth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Games Management</h1>
          <p className="text-muted-foreground">
            Create and manage games, quizzes, and writing challenges for the
            community.
          </p>
        </div>
        <GamesManagement />
      </div>
    </div>
  );
}
