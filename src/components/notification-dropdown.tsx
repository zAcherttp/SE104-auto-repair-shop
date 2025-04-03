"use client";

import { useState } from "react";
import { Bell, CheckCheck, Package, Truck } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "../components/ui/badge";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "task" | "inventory" | "general";
  read: boolean;
}

// Mock notification data
const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New Task Assigned",
    description:
      "You have been assigned a new task: Brake Replacement on Honda Civic",
    timestamp: "2024-04-25T09:30:00",
    type: "task",
    read: false,
  },
  {
    id: "n2",
    title: "Inventory Low",
    description: "Oil Filter (OF-1234) is running low. Reorder point reached.",
    timestamp: "2024-04-25T10:15:00",
    type: "inventory",
    read: false,
  },
  {
    id: "n3",
    title: "Parts Arrived",
    description: "Parts for Toyota Camry (ABC 123) have arrived.",
    timestamp: "2024-04-24T14:00:00",
    type: "general",
    read: true,
  },
  {
    id: "n4",
    title: "Task Completed",
    description: "AC Repair on BMW X5 (JKL 012) has been completed.",
    timestamp: "2024-04-24T16:45:00",
    type: "task",
    read: true,
  },
  {
    id: "n5",
    title: "Customer Feedback",
    description: "John Smith left a 5-star review for your service.",
    timestamp: "2024-04-23T11:20:00",
    type: "general",
    read: true,
  },
];

export function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "inventory":
        return <Package className="h-4 w-4 text-amber-500" />;
      case "general":
        return <Truck className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500/90">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="h-8 text-xs"
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-default"
                >
                  <div
                    className={cn(
                      "w-full p-2 rounded-md",
                      !notification.read && "bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
