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
  const {
    error: tasksError,
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
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

      {/* Debug panel - comment out or remove in production */}
      {/* <div className="mt-4 p-4 border border-dashed border-gray-400 rounded bg-gray-50 text-xs">
        <h4 className="font-bold mb-2">Debug Info:</h4>
        <div>Loading: {isLoading ? "true" : "false"}</div>
        <div>Error: {isError ? "true" : "false"}</div>
        <div>Task Count: {tasks?.data?.length || 0}</div>
        <div className="mt-2">
          <details>
            <summary>Raw Data (click to expand)</summary>
            <pre className="mt-2 overflow-auto max-h-40 p-2 bg-gray-100">
              {JSON.stringify(tasks?.data, null, 2)}
            </pre>
          </details>
        </div>
      </div> */}
    </div>
  );
}
