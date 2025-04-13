"use client";

import type * as React from "react";
import {
  Activity,
  BarChart3,
  Car,
  ClipboardList,
  Cog,
  CreditCard,
  Home,
  MessageSquare,
  Package2,
  Users,
} from "lucide-react";
import { NavGroup } from "./nav-group";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import { AppBanner } from "./app-banner";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("sidebar");
  const data = useMemo(
    () => ({
      garageInfo: {
        name: t("app-name"),
        logo: Package2,
      },
      dashboardItems: [
        { name: t("home"), url: "/home", icon: Home },
        { name: t("tasks"), url: "/tasks", icon: ClipboardList },
        { name: t("vehicles"), url: "/vehicles", icon: Car },
        { name: t("invoices"), url: "/invoices", icon: CreditCard },
        { name: t("inventory"), url: "/inventory", icon: Package2 },
        { name: t("reports"), url: "/reports", icon: BarChart3 },
        { name: t("customers"), url: "/customers", icon: Users },
        { name: t("chat"), url: "/chat", icon: MessageSquare },
        { name: t("garage-logs"), url: "/logs", icon: Activity },
      ],
      garageItems: [
        { name: t("settings"), url: "/settings/garage", icon: Cog },
      ],
    }),
    [t]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBanner garage={data.garageInfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={data.dashboardItems} label="Dashboard" />
        <NavGroup items={data.garageItems} label="Garage" />
      </SidebarContent>
    </Sidebar>
  );
}
