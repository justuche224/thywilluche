import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { AdminSupportPage } from "@/components/support/admin-support-page";

export default async function page() {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }

  return <AdminSupportPage userId={data.user.id} />;
}
