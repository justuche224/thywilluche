import { AddBookPage } from "@/components/admin/shop/books/add-book-page";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const page = async () => {
    const isPermitted = await requireAdmin();
    if (!isPermitted) {
        return redirect("/auth/login");
    }
  return <div className="w-full max-w-7xl mx-auto">
    <AddBookPage />
  </div>;
};
export default page;
