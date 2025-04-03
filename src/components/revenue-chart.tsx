"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

const chartData = [
  { month: "Jan", revenue: 3000 },
  { month: "Feb", revenue: 4500 },
  { month: "Mar", revenue: 7000 },
  { month: "Apr", revenue: 6000 },
  { month: "May", revenue: 8000 },
  { month: "Jun", revenue: 7500 },
  { month: "Jul", revenue: 5000 },
  { month: "Aug", revenue: 9000 },
  { month: "Sep", revenue: 11000 },
  { month: "Oct", revenue: 10000 },
  { month: "Nov", revenue: 12000 },
  { month: "Dec", revenue: 9500 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
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
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          domain={[
            0,
            (dataMax: number) => {
              const ranges = [2000, 5000, 10000, 20000, 50000, 100000];
              return ranges.find((range) => dataMax <= range) || dataMax;
            },
          ]}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
