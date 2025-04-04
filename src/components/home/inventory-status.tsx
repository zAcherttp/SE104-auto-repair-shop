import { Badge } from "../ui/badge";

export default function InventoryStatus() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-md border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground">Oil Filter</div>
            <div className="text-sm text-muted-foreground">Stock: {i} pcs</div>
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
  );
}
