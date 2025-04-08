"use client";

import { useEffect, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Order } from "@/src/app/type";
import { useDebounceValue } from "usehooks-ts";
import { fetchOrders } from "@/src/app/action/orders";
import OrdersBoard from "@/src/components/orders/order-board";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounceValue(
    "",
    300
  );
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // In your component:
  useEffect(() => {
    async function loadOrders() {
      const data = await fetchOrders();
      setOrders(data);
    }
    loadOrders();
  }, []);

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm, setDebouncedSearchTerm]);

  useEffect(() => {
    const applyFiltersAndSearch = () => {
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
          // Assuming we have a current user context, for now just filter by "Mike Johnson"
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
          // No additional filtering
          break;
      }
      setFilteredOrders(result);
    };

    applyFiltersAndSearch();
  }, [orders, debouncedSearchTerm, activeFilter]);

  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
  };

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilterSelect("all")}>
                  All orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect("my")}>
                  My orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterSelect("due-today")}
                >
                  Due Today
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => setIsNewOrderOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </header>
      <OrdersBoard
        orders={filteredOrders}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 grow-1"
      />
    </div>
  );
}
