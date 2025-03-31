"use client";

import { ThemeToggle } from "./theme-toggle";
import { UserProfile } from "./user-profile";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { NotificationDropdown } from "@/src/components/notification-dropdown";
import React from "react";

export function Header() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname) return [];

    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return [];

    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        href,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="stick</div>y shrink-0 gap-2 top-0 z-10 flex transition-[width,height] ease-linear h-16 items-center justify-between border-b bg-background px-4 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {/* <div className="absolute h-16 inset-0 overflow-hidden">
        <Aurora />
      </div> */}
      <div className="z-10 flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* User profile and actions on the right */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationDropdown />
        <UserProfile />
      </div>
    </header>
  );
}
