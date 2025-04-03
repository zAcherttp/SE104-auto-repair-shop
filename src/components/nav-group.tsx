"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import { usePathname } from "../i18n/navigation";

export function NavGroup({
  items,
  label,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  label: string;
}) {
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-semibold text-muted-foreground">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              isActive={isActive(item.url)}
              asChild
              tooltip={item.name}
              className="text-muted-foreground"
            >
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
