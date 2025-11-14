import { AddMerchPage } from "@/components/admin/shop/merch/add-merch-page";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return redirect("/");
  }
  return (
    <div className="w-full max-w-7xl mx-auto">
      <AddMerchPage />
    </div>
  );
};
export default page;
