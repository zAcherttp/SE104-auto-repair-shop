export type Priority = "low" | "medium" | "high";

export const PriorityMap: { [key in Priority]: number } = {
  low: 1,
  medium: 2,
  high: 3,
};

export type Status = "pending" | "in-progress" | "completed";

export type Customer = {
  name: string;
};

export type Vehicle = {
  year: number;
  make: string;
  model: string;
};

export type AssignedUser = {
  initials: string;
  name?: string;
  avatarUrl?: string;
};

export type Order = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  customer: Customer;
  vehicle: Vehicle;
  dueDate?: string | Date;
  assignedTo?: AssignedUser;
  createdAt?: string | Date;
};
export interface ColumnConfig {
  title: string;
  columnId: Status;
  borderColor: string;
}
