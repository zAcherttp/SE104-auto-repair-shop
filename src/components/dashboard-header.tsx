"use client";

import { ThemeToggle } from "./theme-toggle";
import { UserProfile } from "./user-profile";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { usePathname } from "../i18n/navigation";
import { NotificationDropdown } from "@/src/components/notification-dropdown";
import React from "react";

export function Header() {
  const pathname = usePathname();

  function formatPathname(path: string) {
    // Format the pathname to remove the leading slash and replace hyphens with spaces
    // capitalize the first letter of each word
    return path
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <header
      className="backdrop-blur-sm sticky shrink-0 gap-2 top-0 z-10 flex transition-[width] ease-linear h-16 items-center justify-between border-b bg-background/60
     px-4"
    >
      <div className="z-10 flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{formatPathname(pathname)}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
        <UserProfile />
      </div>
    </header>
  );
}
