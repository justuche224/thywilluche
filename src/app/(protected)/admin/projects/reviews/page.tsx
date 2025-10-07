import { getAllReviews } from "@/actions/admin/projects";
import { ReviewsList } from "@/components/admin/projects/reviews-list";

export default async function ReviewsPage() {
  const result = await getAllReviews();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Reviews</h1>
        <p className="text-muted-foreground">
          Manage and approve user reviews for projects
        </p>
      </div>

      <ReviewsList reviews={result.reviews || []} />
    </div>
  );
}
