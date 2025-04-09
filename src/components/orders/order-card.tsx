// src/components/orders/order-card.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { Order } from "@/src/app/type";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Car, Clock, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import React, { memo, useMemo } from "react";

interface OrderCardProps {
  order: Order;
  className?: string;
  disabled?: boolean;
}

const OrderCardContent = memo(
  function OrderCardContent({ order }: Omit<OrderCardProps, "className">) {
    const priorityColor = useMemo(
      () =>
        ({
          low: "flex gap-2 rounded-xl text-sm h-fit text-green-500 border-green-500/20 bg-green-500/10",
          medium:
            "flex gap-2 rounded-xl text-sm h-fit text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
          high: "flex gap-2 rounded-xl text-sm h-fit text-red-500 border-red-500/20 bg-red-500/10",
        }[order.priority]),
      [order.priority]
    );

    return (
      <>
        <CardHeader className="gap-0">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-foreground text-lg">
                {order.title}
              </h3>
            </div>
            <Badge className={priorityColor}>
              {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {order.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              <span>
                {order.vehicle.year} {order.vehicle.make} {order.vehicle.model}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            {order.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(order.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {order.assignedTo && (
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={order.assignedTo.avatarUrl}
                  alt={order.assignedTo.name}
                />
                <AvatarFallback className="text-xs">
                  {order.assignedTo.initials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.order.id === nextProps.order.id &&
      prevProps.disabled === nextProps.disabled
    );
  }
);

function OrderCard({ order, className, disabled = false }: OrderCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    disabled: disabled,
  });

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-pointer border select-none bg-background",
        isDragging && "opacity-50",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
    >
      <OrderCardContent order={order} disabled={disabled} />
    </Card>
  );
}

export { OrderCard };
