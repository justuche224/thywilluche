import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { serverAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - The Will Uche",
  description: "Manage your application",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await serverAuth();

  if (!data?.user) {
    redirect("/auth/login");
  }

  if (data.user.role !== "ADMIN") {
    return redirect("/");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <p>Thywill&apos;s Dashboard</p>
          </div>
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
