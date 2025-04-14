"use server";

import { ApiResponse } from "@/lib/type";

type MetricCardBase = {
  difference: string;
};

type TotalRevenue = {
  totalRevenue: string;
} & MetricCardBase;

export async function fetchTotalRevenue(): Promise<ApiResponse<TotalRevenue>> {
  try {
    //todo: fetch 2 months of data from the API

    // Simulate API call
    const totalRevenue = "45231.89"; // Replace with actual API call
    const difference = "1.12"; // Replace with actual calculation

    return { error: null, data: { totalRevenue, difference } };
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
    // Simulate API call
    const newCustomers = "2350"; // Replace with actual API call
    const difference = "1.08"; // Replace with actual calculation

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
    // Simulate API call
    const activeRepairs = "12"; // Replace with actual API call
    const difference = "0.78"; // Replace with actual calculation

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
    // Simulate API call
    const carsRepaired = "8"; // Replace with actual API call
    const difference = "0.65"; // Replace with actual calculation

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
  month: string;
  revenue: string;
};

export async function fetchRevenueChartData(): Promise<
  ApiResponse<RevenueChartData[]>
> {
  try {
    // Simulate API call
    const data: RevenueChartData[] = [
      { month: "January", revenue: "10000" },
      { month: "February", revenue: "15000" },
      { month: "March", revenue: "20000" },
      { month: "April", revenue: "25000" },
      { month: "May", revenue: "30000" },
      { month: "June", revenue: "35000" },
    ]; // Replace with actual API call

    return { error: null, data };
  } catch (error) {
    console.error("Failed to fetch revenue chart data:", error);
    return {
      error: new Error("Failed to fetch revenue chart data"),
      data: [],
    };
  }
}
