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
import { memo } from "react";

interface NavGroupProps {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  label: string;
}

export const NavGroup = memo(function NavGroup({
  items,
  label,
}: NavGroupProps) {
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
});
