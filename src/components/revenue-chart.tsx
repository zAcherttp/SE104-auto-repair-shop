"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { fetchRevenueChartData } from "@/src/app/action/home";
import { useQuery } from "@tanstack/react-query";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { useTranslations } from "next-intl";

function formatUSD(value: number): string {
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatVND(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(0)}B ₫`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(0)}M ₫`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(0)}K ₫`;
  }
  return `${value.toFixed(0)} ₫`;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart({ className }: { className?: string }) {
  const { error: monthlyRevenueError, data: monthlyRevenueData } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: () => fetchRevenueChartData(),
  });

  const t = useTranslations("date");
  const t_ = useTranslations("global");
  const currency = t_("currency");
  const locale = t_("locale-code");
  const defaultCurrency = "USD";
  const USDtoVND = 25000;

  if (monthlyRevenueError) {
    console.error("Error fetching monthly revenue data:", monthlyRevenueError);
    return <div>Error loading chart data</div>;
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <AreaChart
        accessibilityLayer
        // data={chartData}
        data={monthlyRevenueData?.data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => t(`months.${value}`)}
        />
        <YAxis
          dataKey="revenue"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            if (currency === defaultCurrency) {
              return formatUSD(value);
            }

            return formatVND(value * USDtoVND);
          }}
          domain={[
            0,
            (dataMax: number) => {
              const ranges = [
                2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000,
                1000000,
              ];
              return ranges.find((range) => dataMax <= range) || dataMax;
            },
          ]}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="w-50"
              labelFormatter={(value) => t(`months.${value}`)}
              valueFormatter={(value) => {
                if (currency === defaultCurrency) {
                  return (value as number).toLocaleString(locale, {
                    style: "currency",
                    currency: currency,
                  });
                }
                return ((value as number) * USDtoVND).toLocaleString(locale, {
                  style: "currency",
                  currency: currency,
                });
              }}
            />
          }
        />
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="revenue"
          type="natural"
          fill="url(#fillRevenue)"
          fillOpacity={0.4}
          stroke="var(--color-revenue)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
