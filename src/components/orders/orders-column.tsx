"use client";

import { useDroppable } from "@dnd-kit/core";
import { Order, Status } from "@/src/app/type";
import { OrderCard } from "./order-card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface OrderColumnProps {
  title: string;
  columnId: Status;
  headingColor: string;
  orders: Order[];
}

export function OrderColumn({
  title,
  columnId,
  headingColor,
  orders,
}: OrderColumnProps) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div ref={setNodeRef} className="flex flex-col bg-muted/20 rounded-md p-4 ">
      <h3 className={cn("font-semibold mb-3", headingColor)}>{title}</h3>

      <div className="space-y-3">
        <ScrollArea>
          <div className="flex flex-col gap-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </ScrollArea>

        {orders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No orders
          </div>
        )}
      </div>
    </div>
  );
}
