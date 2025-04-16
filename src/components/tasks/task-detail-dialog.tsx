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
  ChevronsUpDown,
} from "lucide-react";
import { Input } from "../ui/input";
import { ComboBox } from "../ui/combobox";
import { DatePicker } from "../ui/date-picker";
import { useEffect, useState } from "react";

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
    onEdit?.(editedTask);
    setIsEditMode(false);
  };

  const updateField = <K extends keyof Task>(field: K, value: Task[K]) => {
    setEditedTask((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const mechanicUsers: AssignedMechanic[] = [
    { id: "1", first_name: "John", last_name: "Smith" },
    { id: "2", first_name: "Jane", last_name: "Smith" },
    { id: "3", first_name: "Mike", last_name: "Johnson" },
    { id: "4", first_name: "Emily", last_name: "Davis" },
    { id: "5", first_name: "Chris", last_name: "Brown" },
  ];

  const formattedMechanicUsers = mechanicUsers.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`,
  }));

  const handleAssignMechanic = ({
    value,
  }: {
    value: string;
    label: string;
  }) => {
    const selectedMechanic = mechanicUsers.find((user) => user.id === value);
    updateField("assignedTo", selectedMechanic);
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
                  { value: "pending", label: "Pending" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
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
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ContactRound className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Assigned To</p>
              </div>
              <ComboBox
                disabled={!isEditMode}
                items={formattedMechanicUsers}
                value={
                  editedTask.assignedTo
                    ? `${editedTask.assignedTo.first_name} ${editedTask.assignedTo.last_name}`
                    : "Unassigned"
                }
                onChange={(value) => {
                  const selectedMechanic = formattedMechanicUsers.find(
                    (user) => user.value === value
                  );
                  if (!selectedMechanic) {
                    updateField("assignedTo", undefined);
                    return;
                  }
                  handleAssignMechanic(selectedMechanic);
                }}
              />
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
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
              {task.description || "No description provided."}
            </div>
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
          <DialogClose asChild>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
