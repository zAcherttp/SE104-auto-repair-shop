"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Filter, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Task, PriorityMap, Status } from "@/lib/type/common";
import { useDebounceValue } from "usehooks-ts";
import { TaskBoard } from "@/src/components/tasks/task-board";
import NewTaskDialogForm from "./new-order-dialog";
import { fetchOrders, updateOrderStatus } from "@/src/app/action/orders";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function TaskContainer() {
  console.log("=== TaskContainer Rendered ===");

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchOrders(),
  });
  console.log("🔍 useQuery result:", { tasksData, isLoading });

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    console.log("=== TaskContainer Debug ===");
    console.log("tasksData:", tasksData);
    console.log("tasksData?.data:", tasksData?.data);
    console.log("tasksData?.error:", tasksData?.error);
    console.log("isLoading:", isLoading);

    if (tasksData?.data) {
      console.log("TaskContainer received data:", tasksData.data);
      setTasks(tasksData.data);
    } else {
      console.log("No data received or data is falsy");
    }
  }, [tasksData]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 200);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isTransitioning, startTransition] = useTransition();

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const searchFilteredOrders = useMemo(() => {
    if (!debouncedSearchTerm) return tasks;

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    return tasks.filter(
      (order) =>
        order.title.toLowerCase().includes(searchLower) ||
        order.description?.toLowerCase().includes(searchLower) ||
        order.customer?.name.toLowerCase().includes(searchLower) ||
        `${order.vehicle?.make} ${order.vehicle?.model}`
          .toLowerCase()
          .includes(searchLower)
    );
  }, [tasks, debouncedSearchTerm]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return searchFilteredOrders;

    return searchFilteredOrders.filter((order) => {
      if (activeFilter === "my") {
        return order.assignedTo?.id === "1";
      }

      if (activeFilter === "due-today") {
        const today = new Date().toISOString().split("T")[0];
        return (
          order.dueDate &&
          new Date(order.dueDate).toISOString().split("T")[0] === today
        );
      }

      return true;
    });
  }, [searchFilteredOrders, activeFilter]);

  // console.log("Current tasks state:", tasks);
  // console.log("Filtered orders:", filteredOrders);

  const handleFilterSelect = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  const handleDragEnd = useCallback(
    (orderId: string, newStatus: Status) => {
      // Find the order
      const orderToUpdate = tasks.find((order) => order.id === orderId);
      if (!orderToUpdate || orderToUpdate.status === newStatus) return;

      // Optimistic update
      setTasks((prevOrders) => {
        const updated = prevOrders
          .map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
          .sort((a, b) => PriorityMap[b.priority] - PriorityMap[a.priority]);
        return updated;
      });

      // Server update with error handling
      startTransition(async () => {
        try {
          const result = await updateOrderStatus(orderId, newStatus);
          if (result.error) {
            // Revert optimistic update on failure
            setTasks(tasks);
            toast.error("Failed to update task status on server 1");
          } else {
            const statusText =
              {
                Pending: "Pending",
                "In Progress": "In Progress",
                Completed: "Completed",
              }[newStatus] || newStatus;

            toast.success(`Task status updated to ${statusText}`);
          }
        } catch (error) {
          // Revert optimistic update on error
          console.error("Error updating task status:", error);
          setTasks(tasks);
          toast.error("Failed to update task status on server 2");
        }
      });
    },
    [tasks, startTransition]
  );

  const handleNewOrder = useCallback((order: Task) => {
    setTasks((prev) => [order, ...prev]);
    toast.success("New order created");
  }, []);

  const FilterDropdown = memo(function FilterDropdown({
    onFilterSelect,
  }: {
    onFilterSelect: (filter: string) => void;
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onFilterSelect("all")}>
            All orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterSelect("my")}>
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterSelect("due-today")}>
            Due Today
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  });

  return (
    <div className="flex flex-col">
      <header className="grow-0 border-b sticky top-16 z-10 bg-background/60 backdrop-blur-sm ">
        <div className="flex h-16 items-center px-4">
          <div className="mr-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <FilterDropdown onFilterSelect={handleFilterSelect} />
          </div>
          <NewTaskDialogForm onCreateOrder={handleNewOrder} />
        </div>
      </header>

      <TaskBoard
        tasks={filteredOrders}
        onStatusChange={handleDragEnd}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 grow-1"
        isLoading={isLoading}
        isUpdating={isTransitioning}
      />
    </div>
  );
}
