import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { AdminSupportTicketDetail } from "@/components/support/admin-support-ticket-detail";

export default async function AdminSupportTicketPage({
  params,
}: {
  params: { id: string };
}) {
  const authData = await serverAuth();
  if (!authData?.user) {
    redirect("/auth/login");
  }

  if (authData.user.role !== "ADMIN") {
    redirect("/");
  }

  const ticketId = parseInt(params.id);
  if (isNaN(ticketId)) {
    redirect("/admin/support");
  }

  return (
    <AdminSupportTicketDetail ticketId={ticketId} userId={authData.user.id} />
  );
}
