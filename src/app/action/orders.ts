"use server";

import z from "zod";
import { Task, Status, Priority } from "../../../lib/type/common";
import { revalidatePath } from "next/cache";
import { taskFormSchema } from "@/lib/schema";
import { ApiResponse } from "../../../lib/type/common";

import { supabase } from "@/lib/supabase/supabase";
export async function fetchOrders(): Promise<ApiResponse<Task[]>> {
  try {
    const { data, error } = await supabase.rpc("get_repair_orders_details");
    if (error) {
      return {
        error: new Error("Failed to fetch orders from Supabase"),
        data: undefined,
      };
    }

    const tasks: Task[] = data.map((item: any) => {
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

      // console.log("Processing item:", item);

      return {
        id: item.repairorder_id,
        title: item.repairorder_title,
        description: item.repairorder_description,
        priority: validPriority,
        status: item.repairorder_status as Status, // Ensure status is correctly typed
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
        createdAt: new Date(item.repairorder_createdat),
      };
    });

    // console.log("Fetched orders:", tasks);
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
    const { data: existingRecord, error: selectError } = await supabase
      .from("repairorder")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!existingRecord) {
      return {
        error: new Error("Record not found"),
        data: undefined,
      };
    }

    const { error, data: updateResult } = await supabase
      .from("repairorder")
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

    // 3. Transform the data using existing transformation logic
    if (allTasks && allTasks.length > 0) {
      const item = allTasks[0];

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
        status: item.repairorder_status as Status, // Ensure status is correctly typed
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
        createdAt: new Date(item.repairorder_createdAt),
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
  order: z.infer<typeof taskFormSchema>,
  customerId: string | null = null,
  workerId: string | null = null
): Promise<ApiResponse<Task>> {
  try {
    const result = taskFormSchema.safeParse(order);

    if (!result.success) {
      console.error("Validation failed:", result.error.format());
      return { error: new Error("Validation failed"), data: undefined };
    }

    // Ensure priority has first letter capitalized for storage
    const validPriority: Priority = (result.data.priority
      .charAt(0)
      .toUpperCase() + result.data.priority.slice(1).toLowerCase()) as Priority;

    // console.log("Creating order with data:", {
    //   title: result.data.title,
    //   description: result.data.description,
    //   priority: validPriority,
    //   dueDate: result.data.dueDate?.toISOString().split("T")[0],
    //   customer: result.data.customer,
    //   vehicle: result.data.vehicle,
    // });

    const { error } = await supabase.rpc(
      "create_repair_order_with_customer_car",
      {
        p_title: result.data.title,
        p_description: result.data.description,
        p_priority: validPriority,
        p_due_date: result.data.dueDate?.toISOString().split("T")[0], // Ensure date is in YYYY-MM-DD format
        p_customer_name: result.data.customer.name,
        p_car_make: result.data.vehicle.make,
        p_car_model: result.data.vehicle.model,
        p_car_year: parseInt(result.data.vehicle.year),
        p_customer_id: customerId,
        p_user_id: workerId,
      }
    );

    if (error) {
      console.error("RPC Error:", error);
      return {
        error: new Error(`Failed to create repair order: ${error.message}`),
        data: undefined,
      };
    }
    revalidatePath("/orders");

    return { data: undefined, error: null };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { error: new Error("Failed to create order"), data: undefined };
  }
}

export async function fetchShortenedCustomersInfo(): Promise<
  ApiResponse<
    {
      customerId: string;
      name: string;
      carBranch: string;
      carPlate: string;
      carModel: string;
      carYear: string;
      phone: string;
    }[]
  >
> {
  try {
    const { data, error } = await supabase.rpc("get_shortened_customers_info");

    if (error) {
      return {
        error: new Error("Failed to fetch customers from Supabase"),
        data: undefined,
      };
    }

    const customers = data.map((item: any) => ({
      customerId: item.customer_id,
      name: item.customer_name,
      carBranch: item.carbrand_name,
      carPlate: item.car_license_plate,
      carModel: item.car_model,
      carYear: String(item.car_year),
      phone: item.customer_phone,
    }));

    // console.log("Fetched customers:", customers);

    return {
      data: customers || [],
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return {
      error: new Error("Failed to fetch customers"),
      data: undefined,
    };
  }
}
// const DEFAULT_ORDERS: Task[] = [
//   {
//     id: "task-1",
//     title: "Oil Change",
//     description: "Full synthetic oil change and filter replacement",
//     customer: {
//       name: "John Smith",
//     },
//     vehicle: {
//       make: "Toyota",
//       model: "Camry",
//       year: "2019",
//     },
//     assignedTo: {
//       id: "1",
//       first_name: "John",
//       last_name: "Smith",
//     },
//     status: "Pending",
//     dueDate: new Date("2023-05-10"),
//     priority: "medium",
//   },
//   {
//     id: "task-2",
//     title: "Brake Replacement",
//     description: "Front brake pad and rotor replacement",
//     customer: {
//       name: "Sarah Williams",
//     },
//     vehicle: {
//       make: "Honda",
//       model: "Civic",
//       year: "2020",
//     },
//     assignedTo: {
//       id: "2",
//       first_name: "Jane",
//       last_name: "Doe",
//     },
//     status: "In Progress",
//     dueDate: new Date("2023-05-12"),
//     priority: "high",
//   },
//   {
//     id: "task-3",
//     title: "Tire Rotation",
//     description: "Rotate and balance all tires",
//     customer: {
//       name: "Robert Johnson",
//     },
//     vehicle: {
//       make: "Ford",
//       model: "F-150",
//       year: "2021",
//     },
//     assignedTo: {
//       id: "1",
//       first_name: "John",
//       last_name: "Smith",
//     },
//     status: "Pending",
//     dueDate: new Date("2023-05-15"),
//     priority: "low",
//   },
//   {
//     id: "task-4",
//     title: "AC Repair",
//     description: "Diagnose and fix AC not cooling",
//     customer: {
//       name: "Jennifer Lee",
//     },
//     vehicle: {
//       make: "BMW",
//       model: "X5",
//       year: "2018",
//     },
//     assignedTo: {
//       id: "2",
//       first_name: "Jane",
//       last_name: "Doe",
//     },
//     status: "In Progress",
//     dueDate: new Date("2023-05-12"),
//     priority: "high",
//   },
//   {
//     id: "task-5",
//     title: "Battery Replacement",
//     description: "Replace battery and test charging system",
//     customer: {
//       name: "Michael Brown",
//     },
//     vehicle: {
//       make: "Chevrolet",
//       model: "Malibu",
//       year: "2017",
//     },
//     assignedTo: {
//       id: "3",
//       first_name: "Mike",
//       last_name: "Johnson",
//     },
//     status: "Completed",
//     dueDate: new Date("2023-05-10"),
//     priority: "medium",
//   },
// ];

export async function fetchWorkerData(): Promise<
  ApiResponse<
    {
      workerId: string;
      firstName: string;
      lastName: string;
      phone: string;
    }[]
  >
> {
  try {
    const { data, error } = await supabase.rpc("fetch_worker_data");

    if (error) {
      return {
        error: new Error("Failed to fetch workers from Supabase"),
        data: undefined,
      };
    }

    const workers = data.map((item: any) => ({
      workerId: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      phone: item.phone,
    }));

    // console.log("Fetched workers:", workers);

    return {
      data: workers || [],
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch workers:", error);
    return {
      error: new Error("Failed to fetch workers"),
      data: undefined,
    };
  }
}

export async function fetchVehicleData(): Promise<
  ApiResponse<
    {
      id: string;
      customerId: string;
      brand: string;
      model: string;
      year: string;
      licensePlate: string;
    }[]
  >
> {
  try {
    const { data, error } = await supabase.rpc("fetch_vehicle_data");

    if (error) {
      return {
        error: new Error("Failed to fetch vehicles from Supabase"),
        data: undefined,
      };
    }

    const vehicles = data.map((item: any) => ({
      id: item.id,
      customerId: item.customer_id,
      brand: item.brand,
      model: item.model,
      year: item.year,
      licensePlate: item.license_plate,
    }));

    // console.log("Fetched vehicles:", vehicles);

    return {
      data: vehicles || [],
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return {
      error: new Error("Failed to fetch vehicles"),
      data: undefined,
    };
  }
}

export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<ApiResponse<Task>> {
  try {
    // 1. Update the repair order in the database

    const updatedPriority: Priority = (
      updates?.priority
        ? updates.priority.charAt(0).toUpperCase() +
          updates.priority.slice(1).toLowerCase()
        : "Medium"
    ) as Priority;

    const { error: updateError } = await supabase
      .from("repairorder")
      .update({
        title: updates.title,
        description: updates.description,
        priority: updatedPriority,
        status: updates.status,
        due_date: updates.dueDate?.toISOString().split("T")[0], // Convert to YYYY-MM-DD
        user_id: updates.assignedTo?.id || null,
      })
      .eq("id", taskId);

    if (updateError) {
      return {
        error: new Error(`Failed to update task: ${updateError.message}`),
        data: undefined,
      };
    }

    // 2. Fetch the updated task with all relationships
    const { data: updatedTaskData, error: fetchError } = await supabase
      .rpc("get_repair_orders_details")
      .eq("repairorder_id", taskId);

    if (fetchError || !updatedTaskData || updatedTaskData.length === 0) {
      return {
        error: new Error("Failed to fetch updated task"),
        data: undefined,
      };
    }

    // 3. Transform the data using your existing logic
    const item = updatedTaskData[0];

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
      createdAt: new Date(item.repairorder_createdat),
    };

    // console.log("Updated task:", updatedTask);

    // 4. Revalidate and return
    revalidatePath("/tasks");
    return { error: null, data: updatedTask };
  } catch (error) {
    console.error("Failed to update task:", error);
    return {
      error: new Error("Failed to update task"),
      data: undefined,
    };
  }
}
