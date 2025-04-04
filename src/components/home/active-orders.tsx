import { Badge } from "../ui/badge";

export default function ActiveOrders() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-md border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground">Brake Replacement</div>
            <div className="text-sm text-muted-foreground">Honda Civic</div>
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
  );
}
