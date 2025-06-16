"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Car, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Status } from "@/lib/type";

// Mock data for demonstration - now organized by license plate
const mockOrdersByPlate = {
  ABC123: [
    {
      id: "ORD-001",
      customerName: "John Doe",
      vehicle: "2020 Honda Civic",
      licensePlate: "ABC123",
      service: "Oil Change & Brake Inspection",
      status: "Completed" as const,
      dateCreated: "2024-01-15",
      estimatedCompletion: "2024-01-16",
      totalCost: 89.99,
      description:
        "Regular maintenance service including oil change and comprehensive brake system inspection.",
    },
    {
      id: "ORD-004",
      customerName: "John Doe",
      vehicle: "2020 Honda Civic",
      licensePlate: "ABC123",
      service: "Air Filter Replacement",
      status: "Pending" as const,
      dateCreated: "2024-01-18",
      estimatedCompletion: "2024-01-20",
      totalCost: 45.0,
      description:
        "Scheduled air filter replacement due for regular maintenance.",
    },
  ],
  XYZ789: [
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      vehicle: "2019 Toyota Camry",
      licensePlate: "XYZ789",
      service: "Engine Diagnostic & Repair",
      status: "In Progress" as const,
      dateCreated: "2024-01-16",
      estimatedCompletion: "2024-01-18",
      totalCost: 245.0,
      description:
        "Diagnostic testing revealed faulty oxygen sensor. Replacement in progress.",
    },
  ],
  DEF456: [
    {
      id: "ORD-003",
      customerName: "Mike Johnson",
      vehicle: "2021 Ford F-150",
      licensePlate: "DEF456",
      service: "Tire Replacement",
      status: "Pending" as const,
      dateCreated: "2024-01-17",
      estimatedCompletion: "2024-01-19",
      totalCost: 320.0,
      description:
        "Full set of tire replacement scheduled. Waiting for tire delivery.",
    },
    {
      id: "ORD-005",
      customerName: "Mike Johnson",
      vehicle: "2021 Ford F-150",
      licensePlate: "DEF456",
      service: "Brake Pad Replacement",
      status: "In Progress" as const,
      dateCreated: "2024-01-18",
      estimatedCompletion: "2024-01-21",
      totalCost: 180.0,
      description: "Front brake pads showing wear, replacement in progress.",
    },
  ],
};

interface OrderResult {
  id: string;
  customerName: string;
  vehicle: string;
  licensePlate: string;
  service: string;
  status: Status;
  dateCreated: string;
  estimatedCompletion: string;
  totalCost: number;
  description: string;
}

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OrderResult[]>([]);

  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const orders =
      mockOrdersByPlate[
        searchQuery.toUpperCase() as keyof typeof mockOrdersByPlate
      ] || [];
    setSearchResults(orders);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Completed":
        return "flex gap-2 rounded-xl text-sm h-fit text-green-500 border-green-500/20 bg-green-500/10";
      case "In Progress":
        return "flex gap-2 rounded-xl text-sm h-fit text-blue-500 border-blue-500/20 bg-blue-500/10";
      case "Pending":
        return "flex gap-2 rounded-xl text-sm h-fit text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
      default:
        return "flex gap-2 rounded-xl text-sm h-fit text-gray-500 border-gray-500/20 bg-gray-500/10";
    }
  };

  // Calculate collective data
  const getCollectiveData = () => {
    if (searchResults.length === 0) return null;

    const totalCost = searchResults.reduce(
      (sum, order) => sum + order.totalCost,
      0
    );
    const latestCompletionDate = searchResults
      .map((order) => new Date(order.estimatedCompletion))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return {
      totalCost: totalCost.toFixed(2),
      latestCompletion: latestCompletionDate.toLocaleDateString(),
      orderCount: searchResults.length,
      vehicle: searchResults[0]?.vehicle,
      customerName: searchResults[0]?.customerName,
    };
  };

  const collectiveData = getCollectiveData();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Orders</CardTitle>
            <CardDescription>
              Enter your vehicle&apos;s license plate to check all order
              statuses and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrderSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <div className="flex gap-2">
                  <Input
                    id="licensePlate"
                    type="text"
                    placeholder="e.g., ABC123"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {collectiveData && (
          <Card className="mb-6 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Summary
              </CardTitle>
              <CardDescription>
                Summary of all orders for vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center rounded-lg">
                  <div className="text-2xl font-bold ">
                    {collectiveData.orderCount}
                  </div>
                  <div className="text-sm">Active Orders</div>
                </div>
                <div className="text-center  rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                    <DollarSign className="h-5 w-5" />
                    {collectiveData.totalCost}
                  </div>
                  <div className="text-sm ">Total Estimated Cost</div>
                </div>
                <div className="text-center  rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold text-blue-600">
                    <Calendar className="h-4 w-4" />
                    {collectiveData.latestCompletion}
                  </div>
                  <div className="text-sm ">Latest Completion</div>
                </div>
                <div className="text-center  rounded-lg">
                  <div className="text-lg font-semibold">
                    {collectiveData.vehicle}
                  </div>
                  <div className="text-sm ">{collectiveData.customerName}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order Details</h2>
            {searchResults.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.service}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{order.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium ">
                        Date Created
                      </Label>
                      <p>{order.dateCreated}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium ">
                        Est. Completion
                      </Label>
                      <p>{order.estimatedCompletion}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium ">Cost</Label>
                      <p className="font-semibold">
                        ${order.totalCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchQuery &&
          searchResults.length === 0 &&
          searchQuery.length > 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p>
                  No orders found for license plate:{" "}
                  <code className="px-1 rounded">{searchQuery}</code>
                </p>
                <p className="text-sm mt-2">
                  Try: ABC123, XYZ789, or DEF456 for demo
                </p>
              </CardContent>
            </Card>
          )}

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Demo License Plates:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(mockOrdersByPlate).map((plate) => (
                <Button
                  key={plate}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(plate)}
                >
                  {plate}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
