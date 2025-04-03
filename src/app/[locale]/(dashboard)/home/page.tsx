import type React from "react";
import Link from "next/link";
import {
  Car,
  ClipboardList,
  CreditCard,
  TrendingDownIcon,
  TrendingUpIcon,
  Users,
} from "lucide-react";
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
import { Badge } from "@/src/components/ui/badge";
import { unstable_noStore } from "next/cache";

export default async function HomePage() {
  unstable_noStore();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="45231.89"
            difference="1.12"
            icon={CreditCard}
            type="currency"
          />
          <MetricCard
            title="New Customers"
            value="2350"
            difference="1.08"
            icon={Users}
            type="value"
          />
          <MetricCard
            title="Active Repairs"
            value="12"
            difference="0.78"
            icon={ClipboardList}
            type="value"
          />
          <MetricCard
            title="Vehicles In Shop"
            value="8"
            difference="0.65"
            icon={Car}
            type="value"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="uppercase font-semibold text-muted-foreground">
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="uppercase font-semibold text-muted-foreground">
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
                      <Badge className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-yellow-500 border-yellow-500/20 bg-yellow-500/10">
                        In Progress
                      </Badge>
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
                      <Badge className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-red-500 border-red-500/20 bg-red-500/10">
                        Low Stock
                      </Badge>
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
  difference: string;
  icon: React.ElementType;
  type?: "currency" | "value";
}

function formatPercentage(difference: string) {
  const percentage = (parseFloat(difference) - 1.0) * 100;
  return `${percentage.toFixed(1)}%`;
}

function formatValue(value: string, type: MetricCardProps["type"]) {
  const numericValue = parseFloat(value);
  switch (type) {
    case "currency":
      // format as currency with 2 decimal places and commas
      return numericValue.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "value":
    default:
      return numericValue.toLocaleString(); // Format as plain number with commas
  }
}

function getTrend(difference: string) {
  const numericDifference = parseFloat(difference);
  return numericDifference > 1 ? "up" : "down";
}

function getTimeframeDifference(
  difference: string,
  value: string,
  type: MetricCardProps["type"]
) {
  const numericDifference = parseFloat(difference);
  const valuef = parseFloat(value);
  const tfDifference = valuef * numericDifference - valuef;

  // return in the format of +- formatted(tfDifference)
  return tfDifference > 0
    ? `+${formatValue(tfDifference.toString(), type)}`
    : formatValue(tfDifference.toString(), type);
}

function MetricCard({
  title,
  value,
  difference,
  icon: Icon,
  type,
}: MetricCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription className="uppercase font-semibold text-muted-foreground">
          {title}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              {formatValue(value, type)}
              <Badge
                variant="outline"
                className={`flex gap-2 rounded-xl text-sm h-fit ${
                  getTrend(difference) === "up"
                    ? "border-green-500/20 bg-green-500/10 "
                    : "border-red-500/20 bg-red-500/10 "
                }`}
              >
                {getTrend(difference) === "up" ? (
                  <TrendingUpIcon className="text-green-500" />
                ) : (
                  <TrendingDownIcon className="text-red-500" />
                )}
                <span
                  className={
                    getTrend(difference) === "up"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {formatPercentage(".12")}
                </span>
              </Badge>
            </div>
            <Button variant={"outline"}>
              <Icon className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 gap-2 flex font-medium">
          {getTimeframeDifference(difference, value, type)}
          <span className="text-muted-foreground font-normal">
            {/* we gonna add switching timeframe later, for now its monthly */}
            from last month
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
