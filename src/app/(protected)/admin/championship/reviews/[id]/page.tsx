import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getChampionshipReviewById } from "@/actions/admin/championship";
import { ChampionshipReviewDetail } from "@/components/admin/championship/championship-review-detail";

export const metadata: Metadata = {
  title: "Review Details | Admin | Thywill Uche",
  description: "View championship review submission details",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChampionshipReviewDetailPage({
  params,
}: PageProps) {
  const reviewData = await getChampionshipReviewById(params.id);

  if (!reviewData.success || !reviewData.review) {
    redirect("/admin/championship/reviews");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 container">
      <ChampionshipReviewDetail review={reviewData.review} />
    </div>
  );
}
