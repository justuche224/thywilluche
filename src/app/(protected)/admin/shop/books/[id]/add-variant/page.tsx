import { AddVariantPage } from "@/components/admin/shop/books/add-variant-page";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const isPermitted = await requireAdmin();
  if (!isPermitted) {
    return redirect("/auth/login");
  }

  const { id } = await params;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <AddVariantPage baseBookId={id} />
    </div>
  );
};

export default page;
