"use client";

import { useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";

import { CustomKanban } from "@/src/components/orders/board";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 sticky">
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
                <DropdownMenuItem>All orders</DropdownMenuItem>
                <DropdownMenuItem>My orders</DropdownMenuItem>
                <DropdownMenuItem>High Priority</DropdownMenuItem>
                <DropdownMenuItem>Due Today</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => setIsNewOrderOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
        {/* <OrdersColumnCard
            title="Pending"
            status="pending"
            orders={orders}
            setOrders={setOrders}
            headingColor="border-t-blue-500"
          />

          <OrdersColumnCard
            title="In Progress"
            status="in-progress"
            orders={orders}
            setOrders={setOrders}
            headingColor="border-t-yellow-500"
          />

          <OrdersColumnCard
            title="Completed"
            status="completed"
            orders={orders}
            setOrders={setOrders}
            headingColor="border-t-green-500" */}
        <CustomKanban />
        {/* </div> */}
      </div>
    </div>
  );
}
