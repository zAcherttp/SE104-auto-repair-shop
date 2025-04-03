import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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

export default function MetricCard({
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
                  {formatPercentage(difference)}
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
