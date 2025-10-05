import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/login");
  }

  if (data.user.role !== "ADMIN") {
    redirect("/");
  }

  return <div>Admin Page</div>;
}
