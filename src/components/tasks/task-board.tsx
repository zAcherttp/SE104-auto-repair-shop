"use client";

import { memo, useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Task, Status } from "@/lib/type/common";
import { TaskColumn } from "./task-column";
import { cn } from "@/lib/utils";
import { DragOverlay } from "@dnd-kit/core";
import { TaskCard, TaskCardSkeleton } from "./task-card";
import { ScrollArea } from "../ui/scroll-area";
import { TaskDetailDialog } from "./task-detail-dialog";

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange?: (orderId: string, newStatus: Status) => void;
  className?: string;
  isLoading?: boolean;
  isUpdating?: boolean;
}

interface ColumnConfig {
  title: string;
  columnId: Status;
  borderColor: string;
}

export const TaskBoard = memo(function TaskBoard({
  tasks,
  onStatusChange,
  className,
  isLoading,
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Column configurations
  const columns = useMemo<ColumnConfig[]>(
    () => [
      {
        title: "Pending",
        columnId: "pending",
        borderColor: "border-yellow-500",
      },
      {
        title: "In Progress",
        columnId: "in-progress",
        borderColor: "border-blue-500",
      },
      {
        title: "Completed",
        columnId: "completed",
        borderColor: "border-green-500",
      },
    ],
    []
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedTask = tasks.find((task) => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id.toString();
      const newStatus = over.id.toString() as Status;

      if (
        newStatus &&
        ["pending", "in-progress", "completed"].includes(newStatus)
      ) {
        onStatusChange?.(taskId, newStatus);
      }
    }

    setActiveTask(null);
  };

  // Handle task click to show details
  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

  // Handle Edit button in detail dialog
  const handleEditTask = (task: Task) => {
    // onEditTask?.(task);
    setDetailDialogOpen(false);
  };

  // Handle Assign button in detail dialog
  const handleAssignTask = (task: Task) => {
    // onAssignTask?.(task);
    setDetailDialogOpen(false);
  };

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={cn("grid", className)}>
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.columnId
            );

            return (
              <TaskColumn
                key={column.columnId}
                title={column.title}
                columnId={column.columnId}
                borderColor={column.borderColor}
                count={columnTasks.length}
              >
                <ScrollArea>
                  <div className="flex flex-col gap-2">
                    {isLoading ? (
                      <TaskCardSkeleton />
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={handleTaskClick}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>

                {columnTasks.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No tasks here
                  </div>
                )}
              </TaskColumn>
            );
          })}
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 500,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          {activeTask ? (
            <TaskCard task={activeTask} onClick={handleTaskClick} />
          ) : null}
        </DragOverlay>
      </DndContext>
      <TaskDetailDialog
        task={selectedTask}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={handleEditTask}
        onAssign={handleAssignTask}
      />
    </>
  );
});
