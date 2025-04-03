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
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "../components/ui/sidebar";
import { AppBanner } from "./app-banner";

const data = {
  garageInfo: {
    name: "GarageFlowPro",
    logo: Package2,
  },
  dashboardItems: [
    {
      name: "Home",
      url: "/home",
      icon: Home,
    },
    {
      name: "Repair Tasks",
      url: "/tasks",
      icon: ClipboardList,
    },
    {
      name: "Vehicles",
      url: "/vehicles",
      icon: Car,
    },
    {
      name: "Invoices",
      url: "/invoices",
      icon: CreditCard,
    },
    {
      name: "Inventory",
      url: "/inventory",
      icon: Package2,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: BarChart3,
    },
    {
      name: "Customers",
      url: "/customers",
      icon: Users,
    },
    {
      name: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Garage Logs",
      url: "/logs",
      icon: Activity,
    },
  ],
  garageItems: [
    {
      name: "Settings",
      url: "/settings/garage",
      icon: Cog,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
