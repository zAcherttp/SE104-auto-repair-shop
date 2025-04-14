"use client";

import { memo, useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Task, Status } from "@/lib/type/common";
import { OrderColumn } from "./orders-column";
import { cn } from "@/lib/utils";
import { DragOverlay } from "@dnd-kit/core";
import { OrderCard, OrderCardSkeleton } from "./order-card";
import { ScrollArea } from "../ui/scroll-area";

interface OrdersBoardProps {
  orders: Task[];
  onStatusChange?: (orderId: string, newStatus: Status) => void;
  className?: string;
  isLoading?: boolean;
  isUpdating?: boolean;
}

interface ColumnConfig {
  title: string;
  columnId: Status;
  borderColor: string;
}

export const OrdersBoard = memo(function OrdersBoard({
  orders,
  onStatusChange,
  className,
  isLoading,
}: OrdersBoardProps) {
  const [activeOrder, setActiveOrder] = useState<Task | null>(null);

  // Column configurations
  const columns = useMemo<ColumnConfig[]>(
    () => [
      {
        title: "Pending",
        columnId: "pending",
        borderColor: "border-yellow-500",
      },
      {
        title: "In Progress",
        columnId: "in-progress",
        borderColor: "border-blue-500",
      },
      {
        title: "Completed",
        columnId: "completed",
        borderColor: "border-green-500",
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
              borderColor={column.borderColor}
              count={columnOrders.length}
            >
              <ScrollArea>
                <div className="flex flex-col gap-2">
                  {isLoading ? (
                    <OrderCardSkeleton />
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </ScrollArea>

              {orders.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No orders
                </div>
              )}
            </OrderColumn>
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
});
