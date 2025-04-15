import { Task } from "@/lib/type/common";
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
} from "lucide-react";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { DatePicker } from "../ui/date-picker";

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
  onAssign,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const priorityColor = {
    low: "text-green-500 border-green-500/20 bg-green-500/10",
    medium: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
    high: "text-red-500 border-red-500/20 bg-red-500/10",
  }[task.priority];

  const statusColor = {
    pending: "text-yellow-600",
    "in-progress": "text-blue-600",
    completed: "text-green-600",
  }[task.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <Badge className={priorityColor}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Customer and Vehicle Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4   w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Customer</p>
                <p className="text-sm text-muted-foreground ml-0.5">
                  {task.customer.name}
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Vehicle</p>
              </div>
              <Input
                disabled={true}
                placeholder={`${task.vehicle.year} ${task.vehicle.make} ${task.vehicle.model}`}
              />
            </div>
          </div>

          {/* Status and Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>

                <Badge
                  variant="outline"
                  className={`mt-1 capitalize text-sm ${statusColor}`}
                >
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <ContactRound className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Assigned To</p>
              </div>
              <Combobox
                disabled={true}
                items={[
                  { value: "unassigned", label: "Unassigned" },
                  { value: "john", label: "John Doe" },
                  { value: "jane", label: "Jane Smith" },
                  { value: "alex", label: "Alex Johnson" },
                ]}
                placeholder={task.assignedTo?.name || "Unassigned"}
              />
            </div>
          </div>

          {/* Created and Due date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm font-medium">Created at</p>
              </div>
              <DatePicker
                date={task.createdAt}
                disabled={false}
                placeholder={!task.createdAt ? "Not set" : undefined}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm font-medium">Due date</p>
              </div>
              <DatePicker
                date={task.dueDate}
                disabled={false}
                placeholder={!task.dueDate ? "Not set" : undefined}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium mb-1">Description</p>
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
              {task.description || "No description provided."}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit?.(task)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => onAssign?.(task)}>
              Assign
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
