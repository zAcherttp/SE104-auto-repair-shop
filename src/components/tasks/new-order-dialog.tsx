"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Task } from "@/lib/type/common";
import {
  createOrder,
  fetchShortenedCustomersInfo,
  fetchWorkerData,
  fetchVehicleData,
} from "@/src/app/action/orders";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { useState, useTransition } from "react";
import { CalendarIcon, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import FormSubmitButton from "../form-submit-button";
import { taskFormSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMemo } from "react";

type FormValues = z.infer<typeof taskFormSchema>;

interface NewTaskDialogFormProps {
  onCreateOrder: (order: Task) => void;
}

export default function NewTaskDialogForm({
  onCreateOrder,
}: NewTaskDialogFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState(false);
  const [workerSearch, setWorkerSearch] = useState(false);

  // Fetch customers data
  const { data: customersData, error: errorFetchingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchShortenedCustomersInfo,
  });

  // Fetch workers
  const { data: workersData, error: errorFetchingWorkers } = useQuery({
    queryKey: ["workers"],
    queryFn: fetchWorkerData,
  });

  // Fetch vehicles data
  const { data: vehiclesData, error: errorFetchingVehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicleData,
  });

  const filteredCars = useMemo(() => {
    if (!selectedCustomerId || !vehiclesData?.data) {
      return [];
    }

    return vehiclesData.data.filter(
      (car) => car.customerId === selectedCustomerId
    );
  }, [selectedCustomerId, vehiclesData]);

  if (errorFetchingCustomers) {
    console.error("Error fetching customers:", errorFetchingCustomers);
  }

  if (errorFetchingWorkers) {
    console.error("Error fetching workers:", errorFetchingWorkers);
  }

  if (errorFetchingVehicles) {
    console.error("Error fetching vehicles:", errorFetchingVehicles);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      customer: {
        name: "",
      },
      vehicle: {
        make: "",
        model: "",
        year: "2025",
      },
      dueDate: new Date(),
      assignedTo: "",
    },
  });

  const selectedCustomerName = form.watch("customer.name");

  const selectedWorkerName = form.watch("assignedTo");

  // Auto-populate vehicle fields when customer is selected
  useEffect(() => {
    if (selectedCustomerName && customersData?.data) {
      const selectedCustomer = customersData.data.find(
        (customer) => customer.name === selectedCustomerName
      );

      if (selectedCustomer) {
        setSelectedCustomerId(selectedCustomer.customerId);
        console.log("Selected Customer ID:", selectedCustomer.customerId);

        form.setValue("vehicle.make", selectedCustomer.carBranch || "");
        form.setValue("vehicle.model", selectedCustomer.carModel || "");
        form.setValue("vehicle.year", selectedCustomer.carYear || "2025");
      }
    } else {
      setSelectedCustomerId("");

      form.setValue("vehicle.make", "");
      form.setValue("vehicle.model", "");
      form.setValue("vehicle.year", "2025");
    }
  }, [selectedCustomerName, customersData, form]);

  useEffect(() => {
    if (selectedWorkerName && workersData?.data) {
      const selectedWorker = workersData.data.find(
        (worker) =>
          `${worker.firstName} ${worker.lastName}` === selectedWorkerName
      );

      if (selectedWorker) {
        setSelectedWorkerId(selectedWorker.workerId);
      }
    } else {
      setSelectedWorkerId("");
    }
  }, [selectedWorkerName, workersData]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      form.reset();
      setSelectedCustomerId("");
      setSelectedWorkerId("");
    }
  };

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      // Optimistic notification - show immediately
      toast.success("Creating new order...", {
        duration: 1000, // Short duration as it will be replaced
      });

      const { data, error } = await createOrder(
        values,
        selectedCustomerId,
        selectedWorkerId
      );

      if (error) {
        // Show error notification
        toast.error("Failed to create order");
        console.error("Failed to create order:", error);
        return;
      }

      // Success notification
      toast.success("New order created successfully!");

      // Close the dialog automatically
      setOpen(false);

      // Call the callback if data exists
      if (data) {
        onCreateOrder(data);
      }

      // Reset form and states
      form.reset();
      setSelectedCustomerId("");
      setSelectedWorkerId("");
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Oil Change" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the work to be done"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center w-full">
              {/* Priority - Left side */}
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1 flex justify-center px-4">
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Worker</FormLabel>
                      <Popover
                        open={workerSearch}
                        onOpenChange={setWorkerSearch}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? workersData?.data?.find(
                                    (worker) =>
                                      worker.firstName +
                                        " " +
                                        worker.lastName ===
                                      field.value
                                  )
                                  ? `${
                                      workersData?.data?.find(
                                        (worker) =>
                                          worker.firstName +
                                            " " +
                                            worker.lastName ===
                                          field.value
                                      )?.firstName
                                    } ${
                                      workersData?.data?.find(
                                        (worker) =>
                                          worker.firstName +
                                            " " +
                                            worker.lastName ===
                                          field.value
                                      )?.lastName
                                    }`
                                  : field.value
                                : "Select worker"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search worker..." />
                            <CommandList>
                              <CommandEmpty>No worker found.</CommandEmpty>
                              <CommandGroup>
                                {workersData?.data?.map((worker) => {
                                  const fullName =
                                    worker.firstName + " " + worker.lastName;
                                  return (
                                    <CommandItem
                                      key={worker.workerId}
                                      value={fullName}
                                      onSelect={(currentValue) => {
                                        field.onChange(
                                          currentValue === field.value
                                            ? ""
                                            : currentValue
                                        );
                                        setWorkerSearch(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          fullName === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="items-center justify-between">
                                        {worker.firstName} {worker.lastName}
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Due Date - Right side */}
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[150px] text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center w-full">
              <div className="flex-shrink-0 pr-6">
                <FormField
                  control={form.control}
                  name="customer.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <Popover
                        open={customerSearch}
                        onOpenChange={setCustomerSearch}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={customerSearch}
                              className={cn(
                                "w-[150px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? customersData?.data?.find(
                                    (customer) => customer.name === field.value
                                  )?.name
                                : "Select customer"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search customer..." />
                            <CommandList>
                              <CommandEmpty>No customer found.</CommandEmpty>
                              <CommandGroup>
                                {customersData?.data?.map((customer) => (
                                  <CommandItem
                                    key={customer.customerId}
                                    value={customer.name}
                                    onSelect={(currentValue) => {
                                      field.onChange(
                                        currentValue === field.value
                                          ? ""
                                          : currentValue
                                      );
                                      setSelectedCustomerId(
                                        customer.customerId
                                      );
                                      setCustomerSearch(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        customer.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex items-center justify-between w-full">
                                      <span className="truncate">
                                        {customer.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        {customer.phone}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Vehicle - Right side */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="vehicle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle</FormLabel>
                      <Popover
                        open={vehicleSearch}
                        onOpenChange={setVehicleSearch}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={vehicleSearch}
                              className={cn(
                                "justify-between truncate",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={!selectedCustomerId}
                            >
                              {field.value
                                ? vehiclesData?.data?.find(
                                    (vehicle) =>
                                      vehicle.customerId === selectedCustomerId
                                  )?.brand +
                                  " " +
                                  vehiclesData?.data?.find(
                                    (vehicle) =>
                                      vehicle.customerId === selectedCustomerId
                                  )?.model
                                : selectedCustomerId
                                ? "Select vehicle"
                                : "Select customer first"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search vehicle..." />
                            <CommandList>
                              <CommandEmpty>No vehicle found.</CommandEmpty>
                              <CommandGroup>
                                {vehiclesData?.data
                                  ?.filter(
                                    (vehicle) =>
                                      vehicle.customerId === selectedCustomerId
                                  ) // Filter here
                                  ?.map((vehicle) => (
                                    <CommandItem
                                      key={vehicle.id}
                                      value={vehicle.brand}
                                      onSelect={() => {
                                        form.setValue(
                                          "vehicle.make",
                                          vehicle.brand
                                        );
                                        form.setValue(
                                          "vehicle.model",
                                          vehicle.model
                                        );
                                        form.setValue(
                                          "vehicle.year",
                                          vehicle.year.toString()
                                        );

                                        setVehicleSearch(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          vehicle.brand === field.value.make
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="flex items-center justify-between w-full">
                                        <span className="truncate">
                                          {vehicle.brand} {vehicle.model}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-2">
                                          {vehicle.licensePlate}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Close
                </Button>
              </DialogClose>
              <FormSubmitButton text="Create" isDisabled={isPending} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
