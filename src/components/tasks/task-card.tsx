// src/components/orders/order-card.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/lib/type/common";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Car, Clock, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import React, { memo, useMemo } from "react";

interface TaskCardProps {
  task: Task;
  className?: string;
  disabled?: boolean;
  onClick: (task: Task) => void;
}

const TaskCardContent = memo(
  function TaskCardContent({
    task,
  }: Omit<TaskCardProps, "className" | "onClick">) {
    const priorityColor = useMemo(
      () =>
        ({
          low: "flex gap-2 rounded-xl text-sm h-fit text-green-500 border-green-500/20 bg-green-500/10",
          medium:
            "flex gap-2 rounded-xl text-sm h-fit text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
          high: "flex gap-2 rounded-xl text-sm h-fit text-red-500 border-red-500/20 bg-red-500/10",
        }[task.priority]),
      [task.priority]
    );

    return (
      <>
        <CardHeader className="gap-0">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-foreground text-lg">
                {task.title}
              </h3>
            </div>
            <Badge className={priorityColor}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {task.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{task.customer.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              <span>
                {task.vehicle.year} {task.vehicle.make} {task.vehicle.model}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {task.assignedTo && (
              <Avatar className="h-6 w-6">
                <AvatarImage
                  alt={`${task.assignedTo.first_name} ${task.assignedTo.last_name[0]}`}
                />
                <AvatarFallback className="text-xs capitalize">
                  {task.assignedTo.first_name[0]}
                  {task.assignedTo.last_name[0]}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.disabled === nextProps.disabled
    );
  }
);

export function TaskCard({
  task,
  className,
  disabled = false,
  onClick,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: disabled,
  });

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (disabled) return;
    onClick(task);
  };

  return (
    <Card
      onClick={handleCardClick}
      data-task-id={task.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-pointer border select-none hover:bg-accent ",
        isDragging && "opacity-50",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
    >
      <TaskCardContent task={task} disabled={disabled} />
    </Card>
  );
}

export function TaskCardSkeleton() {
  return (
    <Card className="border animate-pulse [animation-duration:0.8s]">
      <CardHeader className="gap-0">
        <div className="h-4 w-1/2 bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-3 bg-muted rounded" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
