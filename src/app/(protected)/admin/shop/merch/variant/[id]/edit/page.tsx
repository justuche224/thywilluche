import { EditVariantPage } from "@/components/admin/shop/merch/edit-variant-page";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return redirect("/");
  }

  const { id } = await params;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <EditVariantPage variantId={id} />
    </div>
  );
};

export default page;
