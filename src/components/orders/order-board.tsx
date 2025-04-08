import React, { useEffect, useMemo, useState } from "react";

import { Order } from "@/src/app/type";
import OrderColumn from "./orders-column";
import { Column } from "./orders-column";

interface OrdersBoardProps {
  orders: Order[];
  className?: string;
}

export default function OrdersBoard({ orders, className }: OrdersBoardProps) {
  const [cards, setCards] = useState(orders);

  const columnConfig: Column[] = useMemo(
    () => [
      {
        id: "pending",
        title: "Pending",
        status: "pending",
        headingColor: "border-t-blue-500",
      },
      {
        id: "in-progress",
        title: "In progress",
        status: "in-progress",
        headingColor: "border-t-yellow-500",
      },
      {
        id: "completed",
        title: "Complete",
        status: "completed",
        headingColor: "border-t-green-500",
      },
    ],
    []
  );

  useEffect(() => {
    setCards(orders);
  }, [orders]);

  return (
    <div className={className}>
      {columnConfig.map((column) => (
        <OrderColumn key={column.id} column={column} cards={cards} />
      ))}
    </div>
  );
}
