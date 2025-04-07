export type Order = {
  id: string;
  title: string;
  description: string;
  customer: {
    name: string;
    avatar?: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  assignedTo?: {
    name: string;
    avatar?: string;
    initials: string;
  };
  status: "pending" | "in-progress" | "completed";
  dueDate?: string;
  priority: "low" | "medium" | "high";
};
