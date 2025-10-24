import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { SupportTicketDetail } from "@/components/support/support-ticket-detail";

export default async function SupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authData = await serverAuth();
  if (!authData?.user) {
    redirect("/auth/login?callbackUrl=/support");
  }

  const ticketId = parseInt(id);
  if (isNaN(ticketId)) {
    redirect("/support");
  }

  return <SupportTicketDetail ticketId={ticketId} userId={authData.user.id} />;
}
