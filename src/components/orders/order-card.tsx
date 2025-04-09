// src/components/orders/order-card.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { Order } from "@/src/app/type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, CarFront, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

interface OrderCardProps {
  order: Order;
  className?: string;
  disabled?: boolean;
}

export function OrderCard({
  order,
  className,
  disabled = false,
}: OrderCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    disabled: disabled,
  });

  // Format due date
  const formattedDueDate = order.dueDate
    ? format(new Date(order.dueDate), "MMM d, yyyy")
    : null;

  // Priority badge color
  const priorityColor = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }[order.priority];

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-pointer border select-none",
        isDragging && "opacity-50",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{order.title}</CardTitle>
          <Badge variant="outline" className={cn("text-xs", priorityColor)}>
            {order.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2 space-y-2">
        {order.description && (
          <p className="text-xs text-muted-foreground">{order.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CarFront className="h-3 w-3" />
          <span>
            {order.vehicle.year} {order.vehicle.make} {order.vehicle.model}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{order.customer.name}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          {formattedDueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <span>{formattedDueDate}</span>
            </div>
          )}

          {order.assignedTo && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {order.assignedTo.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
