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
import { Order, PriorityMap, Status } from "@/lib/type/type";
import { useDebounceValue } from "usehooks-ts";
import OrdersBoard from "@/src/components/tasks/order-board";
import NewTaskDialogForm from "./new-order-dialog";
import { updateOrderStatus } from "@/src/app/action/orders";
import { toast } from "sonner";

interface OrdersContainerProps {
  initialOrders: Order[];
}

export default function OrdersContainer({
  initialOrders,
}: OrdersContainerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounceValue(
    "",
    200
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm, setDebouncedSearchTerm]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply search
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      result = result.filter(
        (order) =>
          order.title.toLowerCase().includes(searchLower) ||
          order.description?.toLowerCase().includes(searchLower) ||
          order.customer?.name.toLowerCase().includes(searchLower) ||
          `${order.vehicle?.make} ${order.vehicle?.model}`
            .toLowerCase()
            .includes(searchLower)
      );
    }

    // Apply filters
    switch (activeFilter) {
      case "my":
        result = result.filter(
          (order) => order.assignedTo?.name === "Mike Johnson"
        );
        break;
      case "due-today":
        const today = new Date().toISOString().split("T")[0];
        result = result.filter((order) => order.dueDate === today);
        break;
      case "all":
      default:
        break;
    }
    return result;
  }, [orders, debouncedSearchTerm, activeFilter]);

  const handleFilterSelect = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  // Handle drag and drop to update status
  const handleDragEnd = useCallback(
    (orderId: string, newStatus: Status) => {
      // Find the order
      const orderToUpdate = orders.find((order) => order.id === orderId);
      if (!orderToUpdate || orderToUpdate.status === newStatus) return;

      // Optimistic update
      const updatedOrders = orders
        .map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
        .sort((a, b) => {
          return PriorityMap[b.priority] - PriorityMap[a.priority];
        });

      setOrders(updatedOrders);

      // Server update with error handling
      startTransition(async () => {
        try {
          const result = await updateOrderStatus(orderId, newStatus);
          if (!result.success) {
            // Revert optimistic update on failure
            setOrders(orders);
            toast.error("Failed to update order status");
          } else {
            toast.success(`Order status updated to ${newStatus}`);
          }
        } catch (error) {
          // Revert optimistic update on error
          console.error("Error updating order status:", error);
          setOrders(orders);
          toast.error("Failed to update order status");
        }
      });
    },
    [orders, startTransition]
  );

  const handleNewOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
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

      <OrdersBoard
        orders={filteredOrders}
        onStatusChange={handleDragEnd}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 grow-1"
        isUpdating={isPending}
      />
    </div>
  );
}
