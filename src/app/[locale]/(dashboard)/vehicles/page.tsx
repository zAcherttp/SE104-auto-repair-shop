"use client";

import { useState } from "react";
import { Car, Filter, MessageSquare, Plus, Search, User } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/src/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/src/components/ui/context-menu";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";

interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: "pending" | "in-repair" | "completed" | "not-in-service";
  arrivalDate: string;
  estimatedCompletionDate?: string;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  authorized: boolean;
}

const vehicles: Vehicle[] = [
  {
    id: "v1",
    licensePlate: "ABC 123",
    make: "Toyota",
    model: "Camry",
    year: 2019,
    customer: {
      id: "c1",
      name: "John Smith",
      email: "john.smith@example.com",
    },
    status: "in-repair",
    arrivalDate: "2023-05-01",
    estimatedCompletionDate: "2023-05-05",
  },
  {
    id: "v2",
    licensePlate: "DEF 456",
    make: "Honda",
    model: "Civic",
    year: 2020,
    customer: {
      id: "c2",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
    },
    status: "pending",
    arrivalDate: "2023-05-02",
    estimatedCompletionDate: "2023-05-10",
  },
  {
    id: "v3",
    licensePlate: "GHI 789",
    make: "Ford",
    model: "F-150",
    year: 2021,
    customer: {
      id: "c3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
    },
    status: "completed",
    arrivalDate: "2023-04-28",
    estimatedCompletionDate: "2023-05-03",
  },
  {
    id: "v4",
    licensePlate: "JKL 012",
    make: "BMW",
    model: "X5",
    year: 2018,
    customer: {
      id: "c4",
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
    },
    status: "in-repair",
    arrivalDate: "2023-05-03",
    estimatedCompletionDate: "2023-05-07",
  },
  {
    id: "v5",
    licensePlate: "MNO 345",
    make: "Chevrolet",
    model: "Malibu",
    year: 2017,
    customer: {
      id: "c5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
    },
    status: "completed",
    arrivalDate: "2023-04-25",
    estimatedCompletionDate: "2023-04-30",
  },
  {
    id: "v6",
    licensePlate: "PQR 678",
    make: "Nissan",
    model: "Altima",
    year: 2020,
    customer: {
      id: "c6",
      name: "David Wilson",
      email: "david.wilson@example.com",
    },
    status: "not-in-service",
    arrivalDate: "2023-04-26",
    estimatedCompletionDate: "2023-05-01",
  },
];

const brands: Brand[] = [
  {
    id: "b1",
    name: "Toyota",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: true,
  },
  {
    id: "b2",
    name: "Honda",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: true,
  },
  {
    id: "b3",
    name: "Ford",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: true,
  },
  {
    id: "b4",
    name: "BMW",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: true,
  },
  {
    id: "b5",
    name: "Chevrolet",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: false,
  },
  {
    id: "b6",
    name: "Nissan",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: true,
  },
  {
    id: "b7",
    name: "Mercedes-Benz",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: false,
  },
  {
    id: "b8",
    name: "Audi",
    logo: "/placeholder.svg?height=40&width=40",
    authorized: false,
  },
];

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "in-repair": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "not-in-service":
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function VehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [statusFilter, setStatusFilter] = useState<Vehicle["status"] | "all">(
    "all"
  );
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (statusFilter === "all" || vehicle.status === statusFilter) &&
      (vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const vehiclesByStatus = {
    pending: vehicles.filter((v) => v.status === "pending"),
    "in-repair": vehicles.filter((v) => v.status === "in-repair"),
    completed: vehicles.filter((v) => v.status === "completed"),
    "not-in-service": vehicles.filter((v) => v.status === "not-in-service"),
  };

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="mr-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vehicles..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Vehicles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-repair")}>
                  In Repair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("not-in-service")}
                >
                  Not In Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => setShowAddVehicleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2 p-4">
            <CardContent className="p-0 grid grid-rows-4 divide-y">
              <div className="flex justify-between items-center py-4">
                <div className="text-lg pl-4 font-medium">Pending</div>
                <div className="text-2xl font-bold pr-8">
                  {vehiclesByStatus["pending"].length}
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <div className="text-lg pl-4 font-medium">In Repair</div>
                <div className="text-2xl font-bold pr-8">
                  {vehiclesByStatus["in-repair"].length}
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <div className="text-lg pl-4 font-medium">Completed</div>
                <div className="text-2xl font-bold pr-8">
                  {vehiclesByStatus["completed"].length}
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <div className="text-lg pl-4 font-medium">Not In Service</div>
                <div className="text-2xl font-bold pr-8">
                  {vehiclesByStatus["not-in-service"].length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                All brands we service and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={brand.logo} alt={brand.name} />
                      <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{brand.name}</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          brand.authorized ? "" : "bg-muted"
                        }`}
                      >
                        {brand.authorized ? "Authorized" : "Not Authorized"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter === "all"
                ? "All Vehicles"
                : statusFilter === "pending"
                ? "Pending Vehicles"
                : statusFilter === "in-repair"
                ? "Vehicles In Repair"
                : statusFilter === "completed"
                ? "Completed Vehicles"
                : "Vehicles Not In Service"}
            </CardTitle>
            <CardDescription>
              {statusFilter === "all"
                ? "Manage vehicles currently in the garage"
                : `Showing ${
                    filteredVehicles.length
                  } vehicles with status: ${statusFilter.replace("-", " ")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No vehicles found matching the current filters
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <CardContent
                      className="p-4"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setDialogOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <Badge className={statusColors[vehicle.status]}>
                          {vehicle.status === "pending"
                            ? "Pending"
                            : vehicle.status === "in-repair"
                            ? "In Repair"
                            : vehicle.status === "completed"
                            ? "Completed"
                            : "Not In Service"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Car className="h-4 w-4" />
                        <span>
                          {vehicle.year} • {vehicle.licensePlate}
                        </span>
                      </div>
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <div className="mt-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {vehicle.customer.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{vehicle.customer.name}</span>
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </ContextMenuItem>
                          <ContextMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div>
                          Arrival:{" "}
                          {new Date(vehicle.arrivalDate).toLocaleDateString()}
                        </div>
                        {vehicle.estimatedCompletionDate && (
                          <div>
                            Est. Completion:{" "}
                            {new Date(
                              vehicle.estimatedCompletionDate
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setTimeout(() => {
              setSelectedVehicle(null);
            }, 300);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex justify-between items-center gap-6">
              <DialogTitle className="text-xl">
                {selectedVehicle?.make} {selectedVehicle?.model}
              </DialogTitle>
              <Badge
                className={
                  selectedVehicle ? statusColors[selectedVehicle.status] : ""
                }
              >
                {selectedVehicle?.status === "pending"
                  ? "Pending"
                  : selectedVehicle?.status === "in-repair"
                  ? "In Repair"
                  : selectedVehicle?.status === "completed"
                  ? "Completed"
                  : "Not In Service"}
              </Badge>
            </div>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Vehicle Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedVehicle.year} {selectedVehicle.make}{" "}
                        {selectedVehicle.model}
                      </span>
                    </div>
                    <div>License Plate: {selectedVehicle.licensePlate}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Customer</h4>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {selectedVehicle.customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div>{selectedVehicle.customer.name}</div>
                          <div className="text-muted-foreground">
                            {selectedVehicle.customer.email}
                          </div>
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        View Details
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Arrival Date</h4>
                  <div className="text-sm">
                    {new Date(selectedVehicle.arrivalDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Estimated Completion
                  </h4>
                  <div className="text-sm">
                    {selectedVehicle.estimatedCompletionDate
                      ? new Date(
                          selectedVehicle.estimatedCompletionDate
                        ).toLocaleDateString()
                      : "Not specified"}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Repair Tasks</h4>
                <div className="rounded-md border p-4">
                  <div className="text-sm text-muted-foreground">
                    No tasks associated with this vehicle yet.
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end">
            <DialogClose>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAddVehicleDialog}
        onOpenChange={setShowAddVehicleDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter the details of the vehicle to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Select>
                  <SelectTrigger id="make">
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Model" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" placeholder="Year" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Plate</Label>
                <Input id="license" placeholder="License Plate" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-repair">In Repair</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not-in-service">Not In Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Customer Name" />
                <Input placeholder="Customer Email" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrival">Arrival Date</Label>
                <Input id="arrival" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="completion">Estimated Completion</Label>
                <Input id="completion" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the vehicle"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddVehicleDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
