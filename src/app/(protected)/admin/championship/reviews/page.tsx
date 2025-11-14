import { Metadata } from "next";
import { ChampionshipReviewsList } from "@/components/admin/championship/championship-reviews-list";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Championship Reviews | Admin | Thywill Uche",
  description: "View all championship review submissions",
};

export default async function ChampionshipReviewsPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Championship Reviews</h1>
          <p className="text-muted-foreground">
            View all submitted reviews for the championship
          </p>
        </div>
      </div>
      <ChampionshipReviewsList />
    </div>
  );
}
