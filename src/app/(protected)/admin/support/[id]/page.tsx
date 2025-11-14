import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { AdminSupportTicketDetail } from "@/components/support/admin-support-ticket-detail";

export default async function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authData = await serverAuth();
  if (!authData?.user) {
    redirect("/auth/login");
  }

  if (authData.user.role !== "ADMIN") {
    return redirect("/");
  }

  const { id } = await params;
  const ticketId = parseInt(id);
  if (isNaN(ticketId)) {
    redirect("/admin/support");
  }

  return (
    <AdminSupportTicketDetail ticketId={ticketId} userId={authData.user.id} />
  );
}
