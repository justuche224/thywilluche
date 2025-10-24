import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { UserSupportPage } from "@/components/support/user-support-page";

export default async function SupportPage() {
  const authData = await serverAuth();
  if (!authData?.user) {
    redirect("/auth/login?callbackUrl=/support");
  }

  return <UserSupportPage userId={authData.user.id} />;
}
