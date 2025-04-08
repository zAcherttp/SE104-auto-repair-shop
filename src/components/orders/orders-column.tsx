import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import type { Status } from "@/src/app/type";

export type Column = {
  id: string;
  title: string;
  status: Status;
  headingColor: string;
};

export type ColumnType = "Column";

export type ColumnDragData = {
  type: ColumnType;
  column: Column;
};

interface OrderColumnProps {
  column: Column;
  children: React.ReactNode;
  count: number;
  onDrop: (e: React.DragEvent) => void;
}

export default function OrderColumn({
  column,
  children,
  count,
  onDrop,
}: OrderColumnProps) {
  return (
    <Card
      className={`${column.headingColor} border-t-4 flex flex-auto h-full`}
      onDragOver={(e) => e.preventDefault()}
    >
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {column.title}
          </CardTitle>
          <Badge variant="outline">{count}</Badge>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 min-h-0">
        <CardContent onDrop={onDrop} className="w-full h-150">
          {children}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
