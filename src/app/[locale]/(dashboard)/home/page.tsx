import type React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { RecentTransactions } from "@/src/components/home/recent-transactions";
import { RevenueChart } from "@/src/components/revenue-chart";
import ActiveOrders from "@/src/components/home/active-orders";
import InventoryStatus from "@/src/components/home/inventory-status";
import MetricCardGroup from "@/src/components/home/metric-card-group";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import {
  fetchActiveRepairs,
  fetchCarRepaired,
  fetchNewCustomer,
  fetchTotalRevenue,
} from "@/src/app/action/home";

export default async function HomePage() {
  const t = await getTranslations("home");

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["totalRevenue"],
      queryFn: fetchTotalRevenue,
    }),
    queryClient.prefetchQuery({
      queryKey: ["newCustomer"],
      queryFn: fetchNewCustomer,
    }),
    queryClient.prefetchQuery({
      queryKey: ["activeRepairs"],
      queryFn: fetchActiveRepairs,
    }),
    queryClient.prefetchQuery({
      queryKey: ["carRepaired"],
      queryFn: fetchCarRepaired,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-6">
          <MetricCardGroup />
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
                  <div className="uppercase font-semibold text-muted-foreground">
                    <CardTitle>{t("active-tasks")}</CardTitle>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link href="/orders" className="text-foreground">
                      {t("view-tasks")}
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ActiveOrders />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between space-y-0">
                  <div className="uppercase font-semibold text-muted-foreground">
                    <CardTitle>{t("inventory-status")}</CardTitle>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link href="/inventory" className="text-foreground">
                      {t("view-inventory")}
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
    </HydrationBoundary>
  );
}
