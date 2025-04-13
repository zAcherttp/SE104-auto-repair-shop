"use server";

type MetricCardBase = {
  difference: number;
};

type TotalRevenue = {
  totalRevenue: number;
} & MetricCardBase;

export async function fetchTotalRevenue(): Promise<TotalRevenue> {
  try {
    //todo: fetch 2 months of data from the API

    // Simulate API call
    const totalRevenue = 45231.89; // Replace with actual API call
    const difference = 1.12; // Replace with actual calculation

    return { totalRevenue, difference };
  } catch (error) {
    console.error("Failed to fetch total revenue:", error);
    return { totalRevenue: 0, difference: 0 };
  }
}

type NewCustomer = {
  newCustomers: number;
} & MetricCardBase;

export async function fetchNewCustomer(): Promise<NewCustomer> {
  try {
    // Simulate API call
    const newCustomers = 2350; // Replace with actual API call
    const difference = 1.08; // Replace with actual calculation

    return { newCustomers, difference };
  } catch (error) {
    console.error("Failed to fetch new customers:", error);
    return { newCustomers: 0, difference: 0 };
  }
}

type ActiveRepairs = {
  activeRepairs: number;
} & MetricCardBase;

export async function fetchActiveRepairs(): Promise<ActiveRepairs> {
  try {
    // Simulate API call
    const activeRepairs = 12; // Replace with actual API call
    const difference = 0.78; // Replace with actual calculation

    return { activeRepairs, difference };
  } catch (error) {
    console.error("Failed to fetch active repairs:", error);
    return { activeRepairs: 0, difference: 0 };
  }
}

type CarRepaired = {
  carsRepaired: number;
} & MetricCardBase;

export async function fetchCarRepaired(): Promise<CarRepaired> {
  try {
    // Simulate API call
    const carsRepaired = 8; // Replace with actual API call
    const difference = 0.65; // Replace with actual calculation

    return { carsRepaired, difference };
  } catch (error) {
    console.error("Failed to fetch cars repaired:", error);
    return { carsRepaired: 0, difference: 0 };
  }
}
