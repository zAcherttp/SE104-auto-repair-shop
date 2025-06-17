"use server";

import { ApiResponse } from "@/lib/type";
import { supabase } from "@/lib/supabase/supabase";

type MetricCardBase = {
  difference: string;
};

type TotalRevenue = {
  totalRevenue: string;
} & MetricCardBase;

export async function fetchTotalRevenue(): Promise<ApiResponse<TotalRevenue>> {
  try {
    const { data, error } = await supabase.rpc("get_revenue_comparison");

    const totalRevenue = data[0].totalrevenue;
    const difference = data[0].difference;
    return {
      data: {
        totalRevenue: totalRevenue,
        difference: difference,
      },
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch total revenue:", error);
    return {
      error: new Error("Failed to fetch total revenue card"),
      data: { totalRevenue: "0", difference: "0" },
    };
  }
}

type NewCustomer = {
  newCustomers: string;
} & MetricCardBase;

export async function fetchNewCustomer(): Promise<ApiResponse<NewCustomer>> {
  try {
    const { data, error } = await supabase.rpc("get_new_customers_comparison");

    if (error) {
      throw new Error(error.message);
    }
    const newCustomers = data[0].newcustomers;
    const difference = data[0].difference;

    return { error: null, data: { newCustomers, difference } };
  } catch (error) {
    console.error("Failed to fetch new customers:", error);
    return {
      error: new Error("Failed to fetch new customers card"),
      data: { newCustomers: "0", difference: "0" },
    };
  }
}

type ActiveRepairs = {
  activeRepairs: string;
} & MetricCardBase;

export async function fetchActiveRepairs(): Promise<
  ApiResponse<ActiveRepairs>
> {
  try {
    const { data, error } = await supabase.rpc("get_active_repair");

    if (error) {
      throw new Error(error.message);
    }

    const activeRepairs = data[0].newrepairs;
    const difference = data[0].difference;

    return { error: null, data: { activeRepairs, difference } };
  } catch (error) {
    console.error("Failed to fetch active repairs:", error);
    return {
      error: new Error("Failed to fetch active repairs card"),
      data: { activeRepairs: "0", difference: "0" },
    };
  }
}

type CarRepaired = {
  carsRepaired: string;
} & MetricCardBase;

export async function fetchCarRepaired(): Promise<ApiResponse<CarRepaired>> {
  try {
    const { data, error } = await supabase.rpc("get_cars_repaired");

    if (error) {
      throw new Error(error.message);
    }

    const carsRepaired = data[0].carsrepaired;
    const difference = data[0].difference;

    return { error: null, data: { carsRepaired, difference } };
  } catch (error) {
    console.error("Failed to fetch cars repaired:", error);
    return {
      error: new Error("Failed to fetch cars repaired card"),
      data: { carsRepaired: "0", difference: "0" },
    };
  }
}

type RevenueChartData = {
  revenue: string;
  month: string;
};

export async function fetchRevenueChartData(): Promise<
  ApiResponse<RevenueChartData[]>
> {
  try {
    // Simulate API call
    const { data, error } = await supabase.rpc("get_monthly_revenue_past_year"); // Replace with actual API call

    if (error) {
      throw new Error(error.message);
    }

    const transformedData = data.map((item: any) => ({
      month: item.month,
      revenue: item.revenue,
    }));

    // console.log("Transformed data:", transformedData);

    return { error: null, data: transformedData };
  } catch (error) {
    console.error("Failed to fetch revenue chart data:", error);
    return {
      error: new Error("Failed to fetch revenue chart data"),
      data: [],
    };
  }
}

type RecentTransaction = {
  name: string;
  email: string;
  amount: number;
  date: string;
};

export async function fetchRecentTransaction(): Promise<
  ApiResponse<RecentTransaction[]>
> {
  try {
    const { data, error } = await supabase.rpc("get_recent_payments");

    if (error) {
      throw new Error(error.message);
    }

    const recentTransactions = data.map((item: any) => ({
      name: item.name,
      email: item.email,
      amount: item.amount,
      date: item.date,
    }));

    // console.log("Recent transactions:", recentTransactions);

    return { error: null, data: recentTransactions };
  } catch (error) {
    console.error("Failed to fetch recent transactions:", error);
    return {
      error: new Error("Failed to fetch recent transactions"),
      data: [],
    };
  }
}

type ActiveTasks = {
  taskName: string;
  carModel: string;
  status: string;
  assignedTo: string;
}[];

export async function fetchActiveTasks(): Promise<ApiResponse<ActiveTasks>> {
  try {
    const { data, error } = await supabase.rpc(
      "get_in_progress_pending_orders"
    );

    if (error) {
      throw new Error(error.message);
    }

    const activeTasks = data.map((item: any) => ({
      taskName: item.title,
      carModel: item.car_model,
      status: item.status,
      assignedTo: item.username,
    }));

    // console.log("Active tasks:", activeTasks);

    return { error: null, data: activeTasks };
  } catch (error) {
    // console.error("Failed to fetch active tasks:", error);
    return {
      error: new Error("Failed to fetch active tasks"),
      data: [],
    };
  }
}

type InventoryStatus = {
  itemName: string;
  stock: number;
  reorderPoint: number;
  status: string;
}[];

export async function fetchInventoryStatus(): Promise<
  ApiResponse<InventoryStatus>
> {
  try {
    const { data, error } = await supabase.rpc("get_inventory_status");

    if (error) {
      throw new Error(error.message);
    }

    const inventoryStatus = data.map((item: any) => ({
      itemName: item.part_name,
      stock: item.current_stock,
      reorderPoint: item.restore_point,
      status: item.status,
    }));

    // console.log("Inventory status:", inventoryStatus);

    return { error: null, data: inventoryStatus };
  } catch (error) {
    console.error("Failed to fetch inventory status:", error);
    return {
      error: new Error("Failed to fetch inventory status"),
      data: [],
    };
  }
}
