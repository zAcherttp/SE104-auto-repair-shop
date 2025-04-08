import { Order } from "@/src/app/type";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import OrderCard from "./order-card";
import { ScrollArea } from "../ui/scroll-area";

export type Column = {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  headingColor: string;
};

export type ColumnType = "Column";

export type ColumnDragData = {
  type: ColumnType;
  column: Column;
};

interface OrderColumnProps {
  column: Column;
  cards: Order[];
}

export default function OrderColumn({ column, cards }: OrderColumnProps) {
  const filteredCards = cards.filter((c) => c.status === column.status);

  return (
    <Card className={`${column.headingColor} border-t-4 flex flex-auto h-full`}>
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {column.title}
          </CardTitle>
          <Badge variant="outline">{filteredCards.length}</Badge>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 min-h-0">
        <CardContent className="w-full h-150">
          {filteredCards.map((c) => {
            return <OrderCard key={c.id} task={c} />;
          })}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
