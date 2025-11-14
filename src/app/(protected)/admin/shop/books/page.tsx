import BooksPage from "@/components/admin/shop/books/books-page";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminBooksPage() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div>
      <BooksPage />
    </div>
  );
}
