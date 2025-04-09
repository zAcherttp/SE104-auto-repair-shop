"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { ColumnConfig, Order, Status } from "@/src/app/type";
import { OrderColumn } from "./orders-column";
import { cn } from "@/lib/utils";
import { DragOverlay } from "@dnd-kit/core";
import { OrderCard } from "./order-card";

interface OrdersBoardProps {
  orders: Order[];
  onStatusChange?: (orderId: string, newStatus: Status) => void;
  className?: string;
  isUpdating?: boolean;
}

export default function OrdersBoard({
  orders,
  onStatusChange,
  className,
}: OrdersBoardProps) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Column configurations
  const columns = useMemo<ColumnConfig[]>(
    () => [
      {
        title: "Pending",
        columnId: "pending",
        headingColor: "text-yellow-500",
      },
      {
        title: "In Progress",
        columnId: "in-progress",
        headingColor: "text-blue-500",
      },
      {
        title: "Completed",
        columnId: "completed",
        headingColor: "text-green-500",
      },
    ],
    []
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedOrder = orders.find((order) => order.id === active.id);
    if (draggedOrder) {
      setActiveOrder(draggedOrder);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const orderId = active.id.toString();
      const newStatus = over.id.toString() as Status;

      if (
        newStatus &&
        ["pending", "in-progress", "completed"].includes(newStatus)
      ) {
        onStatusChange?.(orderId, newStatus);
      }
    }

    setActiveOrder(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={cn("grid", className)}>
        {columns.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.status === column.columnId
          );

          return (
            <OrderColumn
              key={column.columnId}
              title={column.title}
              columnId={column.columnId}
              headingColor={column.headingColor}
              orders={columnOrders}
            />
          );
        })}
      </div>
      <DragOverlay
        dropAnimation={{
          duration: 500,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        {activeOrder ? <OrderCard order={activeOrder} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
