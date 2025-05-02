"use client";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchInventoryStatus } from "@/src/app/action/home";

const statusColors = {
  Abundant: "bg-green-100 text-green-500 border-green-500/20 bg-green-500/10",
  Sufficient:
    "bg-yellow-100 text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  "Low Stock": "bg-red-100 text-red-500 border-red-500/20 bg-red-500/10",
};

export default function InventoryStatus() {
  const { error: inventoryError, data: inventory } = useQuery({
    queryKey: ["inventoryStatus"],
    queryFn: () => fetchInventoryStatus(),
  });

  if (inventoryError) {
    return <div>Error loading inventory status</div>;
  }

  return (
    <div className="space-y-2">
      {inventory?.data?.map((item) => (
        <div
          key={item.itemName}
          className="rounded-md border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground">{item.itemName}</div>
            <div className="text-sm text-muted-foreground">
              Stock: {item.stock} pcs
            </div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            <Badge
              className={`border ${
                statusColors[item.status as keyof typeof statusColors]
              }`}
            >
              {item.status}
            </Badge>
            <span className="ml-2">Reorder point: {item.reorderPoint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
