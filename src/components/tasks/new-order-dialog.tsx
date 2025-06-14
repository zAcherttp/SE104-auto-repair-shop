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
} from "@/src/app/action/orders";
import { useState, useTransition } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import FormSubmitButton from "../form-submit-button";
import { taskFormSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

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

  if (errorFetchingCustomers) {
    console.error("Error fetching customers:", errorFetchingCustomers);
  }

  if (errorFetchingWorkers) {
    console.error("Error fetching workers:", errorFetchingWorkers);
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

            <div className="grid grid-cols-2 gap-4 pr-12">
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
                              "w-[240px] pl-3 text-left font-normal",
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customersData?.data?.map((customer) => (
                          <SelectItem
                            key={customer.customerId}
                            value={customer.name}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="truncate">{customer.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {customer.carBranch} • {customer.carPlate}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem className="justify-self-end">
                    <FormLabel>Assigned Worker</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workersData?.data?.map((worker) => (
                          <SelectItem
                            key={worker.workerId}
                            value={worker.firstName + " " + worker.lastName}
                          >
                            <div className="flex items-center justify-between w-full">
                              {worker.firstName} {worker.lastName}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="vehicle.make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Toyota"
                        {...field}
                        disabled={!!selectedCustomerName}
                        className={selectedCustomerName ? "bg-muted" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle.model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Camry"
                        {...field}
                        disabled={!!selectedCustomerName}
                        className={selectedCustomerName ? "bg-muted" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle.year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2025"
                        {...field}
                        disabled={!!selectedCustomerName}
                        className={selectedCustomerName ? "bg-muted" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
