"use server";

import { Order, Status } from "../../../lib/type/type";
import { revalidatePath } from "next/cache";

export async function fetchOrders(): Promise<Order[]> {
  try {
    // Simulate API call
    // .sort((a, b) => {
    //         return PriorityMap[a.priority] - PriorityMap[b.priority];
    // either sort here or in the database query

    return Promise.resolve(DEFAULT_ORDERS);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

// Update order status with optimistic update support
export async function updateOrderStatus(
  orderId: string,
  status: Status
): Promise<{ success: boolean; order?: Order }> {
  try {
    // In a real app, this would update the database
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find and update the order
    const updatedOrder = DEFAULT_ORDERS.find((order) => order.id === orderId);
    if (!updatedOrder) {
      return { success: false };
    }

    updatedOrder.status = status;

    // Revalidate the orders page to refresh server data
    revalidatePath("/orders");

    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false };
  }
}

// Create new order action
export async function createOrder(
  order: Omit<Order, "id">
): Promise<{ success: boolean; order?: Order }> {
  try {
    const newOrder: Order = {
      id: `task-${Date.now()}`,
      ...order,
    };

    // In a real app, this would be inserted into the database
    DEFAULT_ORDERS.push(newOrder);

    // Revalidate the orders page
    revalidatePath("/orders");

    return { success: true, order: newOrder };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false };
  }
}

const DEFAULT_ORDERS: Order[] = [
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
      year: 2019,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "pending",
    dueDate: "2023-05-10",
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
      year: 2020,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "in-progress",
    dueDate: "2023-05-11",
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
      year: 2021,
    },
    status: "pending",
    dueDate: "2025-04-07",
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
      year: 2018,
    },
    assignedTo: {
      name: "Alex Turner",
      initials: "AT",
    },
    status: "in-progress",
    dueDate: "2023-05-12",
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
      year: 2017,
    },
    status: "completed",
    dueDate: "2023-05-10",
    priority: "medium",
  },
  {
    id: "task-6",
    title: "Transmission Service",
    description: "Flush and replace transmission fluid",
    customer: {
      name: "David Wilson",
    },
    vehicle: {
      make: "Nissan",
      model: "Altima",
      year: 2020,
    },
    assignedTo: {
      name: "Chris Adams",
      initials: "CA",
    },
    status: "completed",
    dueDate: "2023-05-09",
    priority: "medium",
  },
  {
    id: "task-7",
    title: "Engine Diagnostics",
    description: "Run full diagnostics on engine performance",
    customer: {
      name: "Emily Davis",
    },
    vehicle: {
      make: "Subaru",
      model: "Outback",
      year: 2016,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "pending",
    dueDate: "2023-05-15",
    priority: "high",
  },
  {
    id: "task-8",
    title: "Wheel Alignment",
    description: "Perform 4-wheel alignment",
    customer: {
      name: "Chris Green",
    },
    vehicle: {
      make: "Hyundai",
      model: "Elantra",
      year: 2018,
    },
    assignedTo: {
      name: "Alex Turner",
      initials: "AT",
    },
    status: "in-progress",
    dueDate: "2023-05-14",
    priority: "medium",
  },
  {
    id: "task-9",
    title: "Suspension Check",
    description: "Inspect and repair suspension system",
    customer: {
      name: "Laura White",
    },
    vehicle: {
      make: "Jeep",
      model: "Wrangler",
      year: 2022,
    },
    assignedTo: {
      name: "Chris Adams",
      initials: "CA",
    },
    status: "pending",
    dueDate: "2023-05-16",
    priority: "low",
  },
  {
    id: "task-10",
    title: "Exhaust System Repair",
    description: "Fix exhaust leak and replace muffler",
    customer: {
      name: "James Black",
    },
    vehicle: {
      make: "Volkswagen",
      model: "Jetta",
      year: 2015,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "completed",
    dueDate: "2023-05-13",
    priority: "medium",
  },
  {
    id: "task-11",
    title: "Headlight Replacement",
    description: "Replace both front headlights",
    customer: {
      name: "Anna Taylor",
    },
    vehicle: {
      make: "Mazda",
      model: "CX-5",
      year: 2019,
    },
    assignedTo: {
      name: "Chris Adams",
      initials: "CA",
    },
    status: "pending",
    dueDate: "2023-05-17",
    priority: "low",
  },
  {
    id: "task-12",
    title: "Coolant Flush",
    description: "Flush and replace engine coolant",
    customer: {
      name: "Brian Carter",
    },
    vehicle: {
      make: "Kia",
      model: "Sorento",
      year: 2021,
    },
    assignedTo: {
      name: "Alex Turner",
      initials: "AT",
    },
    status: "in-progress",
    dueDate: "2023-05-18",
    priority: "medium",
  },
  {
    id: "task-13",
    title: "Timing Belt Replacement",
    description: "Replace timing belt and inspect pulleys",
    customer: {
      name: "Sophia Martinez",
    },
    vehicle: {
      make: "Honda",
      model: "Accord",
      year: 2017,
    },
    assignedTo: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    status: "pending",
    dueDate: "2023-05-19",
    priority: "high",
  },
  {
    id: "task-14",
    title: "Spark Plug Replacement",
    description: "Replace all spark plugs and inspect ignition system",
    customer: {
      name: "Ethan Brown",
    },
    vehicle: {
      make: "Chevrolet",
      model: "Impala",
      year: 2016,
    },
    assignedTo: {
      name: "Chris Adams",
      initials: "CA",
    },
    status: "completed",
    dueDate: "2023-05-20",
    priority: "medium",
  },
  {
    id: "task-15",
    title: "Fuel System Cleaning",
    description: "Clean fuel injectors and replace fuel filter",
    customer: {
      name: "Olivia Wilson",
    },
    vehicle: {
      make: "Ford",
      model: "Escape",
      year: 2018,
    },
    assignedTo: {
      name: "Alex Turner",
      initials: "AT",
    },
    status: "in-progress",
    dueDate: "2023-05-21",
    priority: "high",
  },
];
