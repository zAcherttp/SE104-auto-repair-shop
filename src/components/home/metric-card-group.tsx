"use client";

import React from "react";
import MetricCard from "./metric-card";
import {
  fetchActiveRepairs,
  fetchCarRepaired,
  fetchNewCustomer,
  fetchTotalRevenue,
} from "@/src/app/action/home";
import { Error } from "@/src/components/error";
import { Car, ClipboardList, CreditCard, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function MetricCardGroup() {
  const { error: totalRevenueError, data: totalRevenueData } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: () => fetchTotalRevenue(),
  });
  const { error: newCustomerError, data: newCustomerData } = useQuery({
    queryKey: ["newCustomer"],
    queryFn: () => fetchNewCustomer(),
  });
  const { error: activeRepairsError, data: activeRepairsData } = useQuery({
    queryKey: ["activeRepairs"],
    queryFn: () => fetchActiveRepairs(),
  });
  const { error: carRepairedError, data: carRepairedData } = useQuery({
    queryKey: ["carRepaired"],
    queryFn: () => fetchCarRepaired(),
  });

  if (
    totalRevenueError ||
    newCustomerError ||
    activeRepairsError ||
    carRepairedError
  ) {
    return <Error code={500} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={totalRevenueData?.data?.totalRevenue || "0"}
        difference={totalRevenueData?.data?.difference || "0.00"}
        icon={CreditCard}
        type="currency"
      />
      <MetricCard
        title="New Customers"
        value={newCustomerData?.data?.newCustomers || "0"}
        difference={newCustomerData?.data?.difference || "0.00"}
        icon={Users}
        type="value"
      />
      <MetricCard
        title="Active Repairs"
        value={activeRepairsData?.data?.activeRepairs || "0"}
        difference={activeRepairsData?.data?.difference || "0.00"}
        icon={ClipboardList}
        type="value"
      />
      <MetricCard
        title="Cars repaired this month"
        value={carRepairedData?.data?.carsRepaired || "0"}
        difference={carRepairedData?.data?.difference || "0.00"}
        icon={Car}
        type="value"
      />
    </div>
  );
}
