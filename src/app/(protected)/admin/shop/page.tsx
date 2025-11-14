import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminShopPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return <div>Admin Shop Page</div>;
}
