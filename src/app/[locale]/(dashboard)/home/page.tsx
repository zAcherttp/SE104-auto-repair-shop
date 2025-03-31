"use client";

import type React from "react";
import Link from "next/link";
import { Car, ClipboardList, CreditCard, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { RecentTransactions } from "@/src/components/recent-transactions";
import { RevenueChart } from "@/src/components/revenue-chart";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="$45,231.89"
            description="+20.1% from last month"
            icon={CreditCard}
            trend="up"
          />
          <MetricCard
            title="New Customers"
            value="2,350"
            description="+180.1% from last month"
            icon={Users}
            trend="up"
          />
          <MetricCard
            title="Active Repairs"
            value="12"
            description="+19% from last month"
            icon={ClipboardList}
            trend="up"
          />
          <MetricCard
            title="Vehicles In Shop"
            value="8"
            description="+5.4% from last month"
            icon={Car}
            trend="up"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Current tasks in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-md border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Brake Replacement</div>
                      <div className="text-sm text-muted-foreground">
                        Honda Civic
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        In Progress
                      </span>
                      <span className="ml-2">Assigned to: Mike Johnson</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/tasks">View All Tasks</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>
                Low stock items that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-md border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Oil Filter</div>
                      <div className="text-sm text-muted-foreground">
                        Stock: {i} pcs
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                        Low Stock
                      </span>
                      <span className="ml-2">Reorder point: 5</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/inventory">View Inventory</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={cn(
            "text-xs",
            trend === "up"
              ? "text-green-500"
              : trend === "down"
              ? "text-red-500"
              : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
