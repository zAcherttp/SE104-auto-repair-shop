"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
} from "@dnd-kit/core";
import { Task, Status } from "@/lib/type/common";
import { TaskColumn } from "./task-column";
import { cn } from "@/lib/utils";
import { DragOverlay } from "@dnd-kit/core";
import { TaskCard } from "./task-card";
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
  columnColor: string;
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
  const targetColumnIndexRef = useRef<number | null>(null);

  // Column configurations
  const columns = useMemo<ColumnConfig[]>(
    () => [
      {
        title: "Pending",
        columnId: "Pending",
        columnColor: "border-t-yellow-500",
      },
      {
        title: "In Progress",
        columnId: "In Progress",
        columnColor: "border-t-blue-500",
      },
      {
        title: "Completed",
        columnId: "Completed",
        columnColor: "border-t-green-500",
      },
    ],
    []
  );

  // Pre-compute task distribution for each column
  const columnTasks = useMemo(() => {
    return columns.reduce<Record<Status, Task[]>>((acc, column) => {
      acc[column.columnId] = tasks.filter(
        (task) => task.status === column.columnId
      );
      return acc;
    }, {} as Record<Status, Task[]>);
  }, [columns, tasks]);

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedTask = tasks.find((task) => task.id === active.id);
      if (draggedTask) {
        setActiveTask(draggedTask);
        const currentColumnIndex = columns.findIndex(
          (column) => column.columnId === draggedTask.status
        );
        if (currentColumnIndex !== -1) {
          targetColumnIndexRef.current = currentColumnIndex;
        }
      }
    },
    [tasks, columns]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const taskId = active.id.toString();
        const newStatus = over.id.toString() as Status;

        if (
          newStatus &&
          ["Pending", "In Progress", "Completed"].includes(newStatus)
        ) {
          onStatusChange?.(taskId, newStatus);
        }
      }

      setActiveTask(null);
      targetColumnIndexRef.current = null;
    },
    [onStatusChange]
  );

  const handleTaskClick = useCallback(
    (task: Task) => {
      if (activeTask) return; // Prevent opening the dialog while dragging
      setSelectedTask(task);
      setDetailDialogOpen(true);
    },
    [activeTask]
  );

  const handleEditTask = useCallback((task: Task) => {
    // onEditTask?.(task);
    setDetailDialogOpen(false);
  }, []);

  const handleAssignTask = useCallback((task: Task) => {
    // onAssignTask?.(task);
  }, []);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const getNextKeyboardCoordinates = useCallback(
    (
      event: KeyboardEvent,
      {
        currentCoordinates,
        active,
      }: {
        currentCoordinates: { x: number; y: number };
        active: UniqueIdentifier;
      }
    ) => {
      // Only handle arrow keys, return current coordinates for other keys
      if (event.code !== "ArrowRight" && event.code !== "ArrowLeft") {
        return currentCoordinates;
      }

      const currentTask = tasks.find((task) => task.id === active);
      if (!currentTask) return currentCoordinates;

      // Get all column rects at once
      const columnRects = columns
        .map((column) => {
          const columnEl = document.querySelector(
            `[data-column-id="${column.columnId}"]`
          );
          return columnEl ? columnEl.getBoundingClientRect() : null;
        })
        .filter(Boolean);

      if (columnRects.length === 0) return currentCoordinates;

      // Find the current column index by matching the active task's status
      const currentColumnIndex = columns.findIndex(
        (column) => column.columnId === currentTask.status
      );

      // Calculate target index based on current position and key pressed
      let targetIndex = targetColumnIndexRef.current ?? currentColumnIndex;

      switch (event.code) {
        case "ArrowRight":
          // Move to next column or wrap to first
          targetIndex = (targetIndex + 1) % columnRects.length;
          break;

        case "ArrowLeft":
          // Move to previous column or wrap to last
          targetIndex =
            (targetIndex - 1 + columnRects.length) % columnRects.length;
          break;
      }

      // Store the new target index for future calls
      targetColumnIndexRef.current = targetIndex;

      // Get the task element to calculate its dimensions
      const taskElement = document.querySelector(`[data-task-id="${active}"]`);
      const taskRect = taskElement?.getBoundingClientRect();

      // Default offsets in case we can't find the task element
      const offsetX = taskRect ? taskRect.width / 2 : 0;

      // Get the target column rect
      const targetRect = columnRects[targetIndex];
      if (!targetRect) return currentCoordinates;

      // Calculate new coordinates centered in the target column
      return {
        x: targetRect.left + targetRect.width / 2 - offsetX,
        y: currentCoordinates.y,
      };
    },
    [tasks, columns]
  );

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: getNextKeyboardCoordinates,
  });

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={[mouseSensor, touchSensor, keyboardSensor]}
      >
        <div className={cn("grid", className)}>
          {columns.map((column) => {
            const columnTasksList = columnTasks[column.columnId] || [];

            return (
              <TaskColumn
                key={column.columnId}
                title={column.title}
                columnId={column.columnId}
                columnColor={column.columnColor}
                count={columnTasksList.length}
              >
                <TaskColumn.Content
                  tasks={columnTasksList}
                  isLoading={isLoading}
                  onTaskClick={handleTaskClick}
                />
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
