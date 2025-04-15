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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Car, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

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

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Not set";
    return format(new Date(date), "MMM d, yyyy");
  };

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
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Customer</p>
                <p className="text-sm text-muted-foreground">
                  {task.customer.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Vehicle</p>
                <p className="text-sm text-muted-foreground">
                  {task.vehicle.year} {task.vehicle.make} {task.vehicle.model}
                </p>
              </div>
            </div>
          </div>

          {/* Status and Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {task.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Created and Assigned */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Assigned To</p>
              {task.assignedTo ? (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={task.assignedTo.avatarUrl || "/placeholder.svg"}
                      alt={task.assignedTo.name}
                    />
                    <AvatarFallback className="text-xs">
                      {task.assignedTo.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignedTo.name}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unassigned</p>
              )}
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
          <DialogClose>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
