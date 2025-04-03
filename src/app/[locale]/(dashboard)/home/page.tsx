import type React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Car,
  ClipboardList,
  CreditCard,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import MetricCard from "@/src/components/home/metric-card";
import { Button } from "@/src/components/ui/button";
import { RecentTransactions } from "@/src/components/home/recent-transactions";
import { RevenueChart } from "@/src/components/revenue-chart";
import ActiveTasks from "@/src/components/home/active-tasks";
import { useTranslations } from "next-intl";
import InventoryStatus from "@/src/components/home/inventory-status";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col bg-background">
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
                {t("revenue")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card className="col-span-3 ">
            <CardHeader>
              <CardTitle className="uppercase font-semibold text-muted-foreground">
                {t("recent-transactions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 h-full">
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <CardTitle>{t("active-tasks")}</CardTitle>
                  <CardDescription>{t("active-tasks-desc")}</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/tasks">
                    View All Tasks
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActiveTasks />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>
                    Low stock items that need attention
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/inventory">
                    View Inventory
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <InventoryStatus />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
