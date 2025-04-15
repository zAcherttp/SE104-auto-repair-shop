"use client";

import { useDroppable } from "@dnd-kit/core";
import { Status, Task } from "@/lib/type/common";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { TaskCard, TaskCardSkeleton } from "./task-card";
import { memo } from "react";

interface TaskColumnProps {
  title: string;
  columnId: Status;
  columnColor: string;
  children?: React.ReactNode;
  count?: number;
}

interface TaskColumnContentProps {
  tasks: Task[];
  isLoading?: boolean;
  onTaskClick: (task: Task) => void;
}

const TaskColumnComponent = ({
  title,
  columnId,
  columnColor,
  children,
  count,
}: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <Card
      ref={setNodeRef}
      data-column-id={columnId}
      className={`text-foreground border-1 border-border border-t-4 ${columnColor} flex-auto h-full`}
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
};

const TaskColumnContent = memo(function TaskColumnContent({
  tasks,
  isLoading,
  onTaskClick,
}: TaskColumnContentProps) {
  if (isLoading) {
    return <TaskCardSkeleton />;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No tasks here
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </ScrollArea>
  );
});

export const TaskColumn = Object.assign(TaskColumnComponent, {
  Content: TaskColumnContent,
});
