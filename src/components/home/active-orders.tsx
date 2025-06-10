"use client";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveTasks } from "@/src/app/action/home";
import { Progress } from "@radix-ui/react-progress";

const statusColors = {
  "In Progress":
    "bg-yellow-100 text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  Pending: "bg-red-100 text-red-500 border-red-500/20 bg-red-500/10",
};
export default function ActiveOrders() {
  const { error: tasksError, data: tasks } = useQuery({
    queryKey: ["activeTasks"],
    queryFn: () => fetchActiveTasks(),
  });

  if (tasksError) {
    return <div>Error loading active tasks: {tasksError.message}</div>;
  }

  return (
    <div className="space-y-2">
      {tasks?.data?.map((task, index) => (
        <div
          key={index}
          className="rounded-md border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground">{task.taskName}</div>
            <div className="text-sm text-muted-foreground">{task.carModel}</div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            <Badge
              className={`border ${
                statusColors[task.status as keyof typeof statusColors]
              }`}
            >
              {task.status}
            </Badge>
            <span className="ml-2">Assigned to: {task.assignedTo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
