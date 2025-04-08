import React, { useEffect, useMemo, useState } from "react";

import { Order, Status } from "@/src/app/type";
import OrderColumn from "./orders-column";
import { Column } from "./orders-column";
import OrderCard from "./order-card";

interface OrdersBoardProps {
  orders: Order[];
  className?: string;
}

export default function OrdersBoard({ orders, className }: OrdersBoardProps) {
  const [cards, setCards] = useState(orders);

  //filter orders by status + sort by priority high/medium/low
  const sortByPriority = (a: Order, b: Order) => {
    const priorityOrder = ["high", "medium", "low"];
    return (
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
  };

  const pendingOrders = cards
    .filter((order) => order.status === "pending")
    .sort(sortByPriority);

  const inProgressOrders = cards
    .filter((order) => order.status === "in-progress")
    .sort(sortByPriority);

  const completedOrders = cards
    .filter((order) => order.status === "completed")
    .sort(sortByPriority);

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

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("orderId", orderId);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, status: Status) => {
    const orderId = e.dataTransfer.getData("orderId");

    // Update the order status
    setCards((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  useEffect(() => {
    setCards(orders);
  }, [orders]);

  return (
    <div className={className}>
      <OrderColumn
        column={columnConfig[0]}
        count={pendingOrders.length}
        onDrop={(e) => handleDrop(e, "pending")}
      >
        {pendingOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDragStart={(e) => handleDragStart(e, order.id)}
          />
        ))}
      </OrderColumn>
      <OrderColumn
        column={columnConfig[1]}
        onDrop={(e) => handleDrop(e, "in-progress")}
        count={inProgressOrders.length}
      >
        {inProgressOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDragStart={(e) => handleDragStart(e, order.id)}
          />
        ))}
      </OrderColumn>
      <OrderColumn
        column={columnConfig[2]}
        onDrop={(e) => handleDrop(e, "completed")}
        count={completedOrders.length}
      >
        {completedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDragStart={(e) => handleDragStart(e, order.id)}
          />
        ))}
      </OrderColumn>
    </div>
  );
}
