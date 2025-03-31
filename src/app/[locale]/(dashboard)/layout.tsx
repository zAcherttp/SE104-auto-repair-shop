"use client";

import type React from "react";
import { AppSidebar } from "@/src/components/main-sidebar";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { Header } from "@/src/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
