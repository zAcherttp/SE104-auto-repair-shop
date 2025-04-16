"use server";

import z from "zod";
import { Task, Status } from "../../../lib/type/common";
import { revalidatePath } from "next/cache";
import { taskFormSchema } from "@/lib/schema";
import { ApiResponse } from "../../../lib/type/common";

export async function fetchOrders(): Promise<ApiResponse<Task[]>> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: DEFAULT_ORDERS,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return {
      error: new Error("Failed to fetch orders"),
      data: undefined,
    };
  }
}

// Update order status with optimistic update support
export async function updateOrderStatus(
  orderId: string,
  status: Status
): Promise<ApiResponse<Task>> {
  try {
    // In a real app, this would update the database
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find and update the order
    const updatedOrder = DEFAULT_ORDERS.find((order) => order.id === orderId);
    if (!updatedOrder) {
      return { error: new Error("Order not found"), data: undefined };
    }

    updatedOrder.status = status;

    // Revalidate the orders page to refresh server data
    revalidatePath("/orders");

    return { error: null, data: updatedOrder };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return {
      error: new Error("Failed to update order status"),
      data: undefined,
    };
  }
}

export async function createOrder(
  order: z.infer<typeof taskFormSchema>
): Promise<ApiResponse<Task>> {
  try {
    const result = taskFormSchema.safeParse(order);

    if (!result.success) {
      console.error("Validation failed:", result.error.format());
      return { error: new Error("Validation failed"), data: undefined };
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      status: "pending",
      ...result.data,
    };

    // simulate database insertion
    DEFAULT_ORDERS.push(task);

    // revalidate the orders page
    revalidatePath("/orders");

    return { data: task, error: null };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { error: new Error("Failed to create order"), data: undefined };
  }
}

const DEFAULT_ORDERS: Task[] = [
  {
    id: "task-1",
    title: "Oil Change",
    description: "Full synthetic oil change and filter replacement",
    customer: {
      name: "John Smith",
    },
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2019",
    },
    assignedTo: {
      id: "1",
      first_name: "John",
      last_name: "Smith",
    },
    status: "pending",
    dueDate: new Date("2023-05-10"),
    priority: "medium",
  },
  {
    id: "task-2",
    title: "Brake Replacement",
    description: "Front brake pad and rotor replacement",
    customer: {
      name: "Sarah Williams",
    },
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: "2020",
    },
    assignedTo: {
      id: "2",
      first_name: "Jane",
      last_name: "Doe",
    },
    status: "in-progress",
    dueDate: new Date("2023-05-12"),
    priority: "high",
  },
  {
    id: "task-3",
    title: "Tire Rotation",
    description: "Rotate and balance all tires",
    customer: {
      name: "Robert Johnson",
    },
    vehicle: {
      make: "Ford",
      model: "F-150",
      year: "2021",
    },
    assignedTo: {
      id: "1",
      first_name: "John",
      last_name: "Smith",
    },
    status: "pending",
    dueDate: new Date("2023-05-15"),
    priority: "low",
  },
  {
    id: "task-4",
    title: "AC Repair",
    description: "Diagnose and fix AC not cooling",
    customer: {
      name: "Jennifer Lee",
    },
    vehicle: {
      make: "BMW",
      model: "X5",
      year: "2018",
    },
    assignedTo: {
      id: "2",
      first_name: "Jane",
      last_name: "Doe",
    },
    status: "in-progress",
    dueDate: new Date("2023-05-12"),
    priority: "high",
  },
  {
    id: "task-5",
    title: "Battery Replacement",
    description: "Replace battery and test charging system",
    customer: {
      name: "Michael Brown",
    },
    vehicle: {
      make: "Chevrolet",
      model: "Malibu",
      year: "2017",
    },
    assignedTo: {
      id: "3",
      first_name: "Mike",
      last_name: "Johnson",
    },
    status: "completed",
    dueDate: new Date("2023-05-10"),
    priority: "medium",
  },
];
