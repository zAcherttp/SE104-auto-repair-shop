import { Order } from "@/src/app/type";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User, Car, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

const priorityColors = {
  low: "flex gap-2 rounded-xl text-sm h-fit text-green-500 border-green-500/20 bg-green-500/10",
  medium:
    "flex gap-2 rounded-xl text-sm h-fit text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  high: "flex gap-2 rounded-xl text-sm h-fit text-red-500 border-red-500/20 bg-red-500/10",
};

interface OrderCardProps {
  task: Order;
}

export default function OrderCard({ task }: OrderCardProps) {
  return (
    <Card className="cursor-pointer mb-2">
      <CardHeader className="gap-0">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-lg">{task.title}</h3>
          </div>
          <Badge className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {task.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{task.customer.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-3.5 w-3.5" />
            <span>
              {task.vehicle.year} {task.vehicle.make} {task.vehicle.model}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {task.assignedTo && (
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={task.assignedTo.avatarUrl}
                alt={task.assignedTo.name}
              />
              <AvatarFallback className="text-xs">
                {task.assignedTo.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
