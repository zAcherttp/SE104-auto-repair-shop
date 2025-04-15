"use client";

import { useDroppable } from "@dnd-kit/core";
import { Status } from "@/lib/type/common";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface TaskColumnProps {
  title: string;
  columnId: Status;
  borderColor: string;
  children?: React.ReactNode;
  count?: number;
}

export function TaskColumn({
  title,
  columnId,
  borderColor,
  children,
  count,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`${borderColor} text-foreground border-0 border-t-4  flex-auto h-full`}
    >
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline">{count}</Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
