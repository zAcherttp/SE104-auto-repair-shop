"use server";

import z from "zod";
import { Task, Status, Priority } from "../../../lib/type/common";
import { revalidatePath } from "next/cache";
import { taskFormSchema } from "@/lib/schema";
import { ApiResponse } from "../../../lib/type/common";

import { supabase } from "@/lib/supabase";
export async function fetchOrders(): Promise<ApiResponse<Task[]>> {
  try {
    console.log("Fetching orders from Supabase...");
    const { data, error } = await supabase.rpc("get_repair_orders_details");
    if (error) {
      return {
        error: new Error("Failed to fetch orders from Supabase"),
        data: undefined,
      };
    }

    const tasks: Task[] = data.map((item: any) => {
      // Make sure the priority is one of the expected values
      let validPriority: Priority;
      switch (item.repairorder_priority?.toLowerCase()) {
        case "low":
        case "medium":
        case "high":
          validPriority = item.repairorder_priority.toLowerCase() as Priority;
          break;
        default:
          validPriority = "medium"; // Default fallback
      }

      let validStatus: Status;
      switch (item.repairorder_status?.toLowerCase()) {
        case "pending":
          validStatus = "pending";
          break;
        case "in progress":
        case "in-progress":
          validStatus = "in-progress";
          break;
        case "completed":
          validStatus = "completed";
          break;
        default:
          validStatus = "pending";
      }

      return {
        id: item.repairorder_id,
        title: item.repairorder_title,
        description: item.repairorder_description,
        priority: validPriority,
        status: validStatus,
        customer: {
          name: item.customer_name,
        },
        vehicle: {
          make: item.carbrand_name,
          model: item.car_model,
          year: item.car_year,
        },
        dueDate: new Date(item.repairorder_duedate),
        assignedTo: item.user_id
          ? {
              id: item.user_id,
              first_name: item.user_firstname,
              last_name: item.user_lastname,
            }
          : undefined,
      };
    });

    console.log("Fetched orders AAAAAAAAAAAAAAAAAAAAA:", tasks);
    return {
      data: tasks,
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
    // 1. Update just the status in the repair_orders table
    const { error } = await supabase
      .from("repair_orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      return {
        error: new Error(`Failed to update order status: ${error.message}`),
        data: undefined,
      };
    }

    // 2. Fetch the complete updated task with all its relationships
    const { data: allTasks, error: fetchError } = await supabase
      .rpc("get_repair_orders_details")
      .eq("repairorder_id", orderId);

    if (fetchError) {
      return {
        error: new Error(`Failed to fetch updated task: ${fetchError.message}`),
        data: undefined,
      };
    }

    // 3. Transform the data using your existing transformation logic
    if (allTasks && allTasks.length > 0) {
      const item = allTasks[0];

      // Reuse the same transformation logic from fetchOrders
      let validPriority: Priority;
      switch (item.repairorder_priority?.toLowerCase()) {
        case "low":
        case "medium":
        case "high":
          validPriority = item.repairorder_priority.toLowerCase() as Priority;
          break;
        default:
          validPriority = "medium";
      }

      const updatedTask: Task = {
        id: item.repairorder_id,
        title: item.repairorder_title,
        description: item.repairorder_description,
        priority: validPriority,
        status: item.repairorder_status as Status,
        customer: { name: item.customer_name },
        vehicle: {
          make: item.carbrand_name,
          model: item.car_model,
          year: item.car_year,
        },
        dueDate: new Date(item.repairorder_duedate),
        assignedTo: item.user_id
          ? {
              id: item.user_id,
              first_name: item.user_firstname,
              last_name: item.user_lastname,
            }
          : undefined,
      };

      // 4. Revalidate and return
      revalidatePath("/orders");
      return { error: null, data: updatedTask };
    }

    return {
      error: new Error("No task found after update"),
      data: undefined,
    };
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
    // DEFAULT_ORDERS.push(task);

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
