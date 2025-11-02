import React from "react";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { ReviewsPage } from "@/components/admin/shop/books/reviews-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return redirect("/auth/login");
  }

  const { id } = await params;
  return <ReviewsPage bookId={id} />;
};

export default page;
