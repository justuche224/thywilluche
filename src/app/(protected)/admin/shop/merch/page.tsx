import MerchPage from "@/components/admin/shop/merch/merch-page";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminMerchPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div>
      <MerchPage />
    </div>
  );
}
