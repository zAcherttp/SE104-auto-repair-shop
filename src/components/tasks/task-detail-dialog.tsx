import { AssignedMechanic, Status, Task } from "@/lib/type/common";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import {
  Car,
  Calendar,
  Clock,
  User,
  Activity,
  ContactRound,
  Check,
  ChevronsUpDown,
  Text,
} from "lucide-react";
import { Input } from "../ui/input";
import { ComboBox } from "../ui/combobox";
import { DatePicker } from "../ui/date-picker";
import { useEffect, useState, useTransition } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { fetchWorkerData } from "@/src/app/action/orders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner"; // Add this import
import { updateTask } from "@/src/app/action/orders";
import { set } from "date-fns";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: Task) => void;
  onAssign?: (task: Task) => void;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onEdit,
}: TaskDetailDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [workerSearch, setWorkerSearch] = useState(false);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && isEditMode) {
      setIsEditMode(false);
      setEditedTask({ ...task } as Task); // Reset to original task when closing
    }
    onOpenChange(isOpen);
  };

  const { data: workersData, error: errorFetchingWorkers } = useQuery({
    queryKey: ["workers"],
    queryFn: fetchWorkerData,
  });

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!task || !editedTask) return null;

  const priorityColor = {
    low: "text-green-500 border-green-500/20 bg-green-500/10",
    medium: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
    high: "text-red-500 border-red-500/20 bg-red-500/10",
  }[task.priority];

  const toggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode without saving changes
      setEditedTask({ ...task });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveChanges = () => {
    setIsEditMode(false);
    if (!editedTask) return;

    setIsSaving(true);

    startTransition(async () => {
      try {
        // Show loading toast
        toast.loading("Updating task...");

        const response = await updateTask(task.id, editedTask);
        if (response.error) {
          toast.dismiss();
          toast.error("Failed to update task");
          return;
        }

        // Success
        toast.dismiss();
        toast.success("Task updated successfully!");

        if (response.data) {
          await queryClient.invalidateQueries({
            queryKey: ["orders"],
          });

          if (onEdit) {
            onEdit(response.data);
          }

          // Exit edit mode
          setIsEditMode(false);

          setEditedTask(response.data);
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to update task");
      } finally {
        setIsSaving(false);
      }
    });
  };

  const updateField = <K extends keyof Task>(field: K, value: Task[K]) => {
    setEditedTask((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <Badge className={priorityColor}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4 resize-none">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Vehicle</p>
              </div>
              <Input
                className="w-[200px]"
                disabled={true}
                value={`${task.vehicle.year} ${task.vehicle.make} ${task.vehicle.model}`}
                placeholder={"Not set"}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Status</p>
              </div>
              <ComboBox
                disabled={!isEditMode}
                items={[
                  { value: "Pending", label: "Pending" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Completed", label: "Completed" },
                ]}
                value={editedTask.status}
                onChange={(value) => updateField("status", value as Status)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Customer</p>
              </div>
              <Input
                className="w-[200px]"
                disabled={true}
                value={`${task.customer.name} `}
                placeholder={"Not set"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Assigned to</p>
                </div>
                <Popover open={workerSearch} onOpenChange={setWorkerSearch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!isEditMode}
                      aria-expanded={workerSearch}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? workersData?.data?.find(
                            (worker) =>
                              worker.firstName + " " + worker.lastName === value
                          )?.firstName +
                          " " +
                          workersData?.data?.find(
                            (worker) =>
                              worker.firstName + " " + worker.lastName === value
                          )?.lastName
                        : task.assignedTo?.first_name +
                          " " +
                          task.assignedTo?.last_name}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search framework..." />
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
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setWorkerSearch(false);
                                  setSelectedWorkerId(worker.workerId);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    fullName === value
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm font-medium">Created at</p>
              </div>
              <DatePicker
                className="w-[200px]"
                date={task.createdAt}
                disabled={true}
                placeholder={!task.createdAt ? "Not set" : undefined}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm font-medium">Due date</p>
              </div>
              <DatePicker
                className="w-[200px]"
                date={editedTask.dueDate}
                disabled={!isEditMode}
                icon={ChevronsUpDown}
                placeholder={!editedTask.dueDate ? "Not set" : undefined}
                onDateChange={(date) => updateField("dueDate", date)}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Description</p>
            {!isEditMode ? (
              // View mode - non-editable
              <div className="w-[435px] text-sm text-muted-foreground p-3 bg-muted/50 rounded-md overflow-hidden">
                {task.description || "No description provided."}
              </div>
            ) : (
              // Edit mode - editable textarea
              <Textarea
                value={editedTask.description || ""}
                placeholder="Enter task description..."
                className="w-[435px] bg-transparent rounded-md outline-none resize-none text-sm p-3 "
                onChange={(e) =>
                  updateField("description", e.target.value || undefined)
                }
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Button variant="default" onClick={handleSaveChanges}>
                  Save
                </Button>
                <Button variant="outline" onClick={toggleEditMode}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={toggleEditMode}>
                Edit
              </Button>
            )}
          </div>
          {!isEditMode && (
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
