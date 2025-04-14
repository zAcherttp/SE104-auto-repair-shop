export type ApiResponse<T> = {
  error: Error | null;
  data?: T;
};

export type Priority = "low" | "medium" | "high";

export const PriorityMap: { [key in Priority]: number } = {
  low: 1,
  medium: 2,
  high: 3,
};

export type Status = "pending" | "in-progress" | "completed";

export type CustomerName = {
  name: string;
};

export type Vehicle = {
  year: string;
  make: string;
  model: string;
};

export type AssignedUser = {
  initials: string;
  name?: string;
  avatarUrl?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  customer: CustomerName;
  vehicle: Vehicle;
  dueDate?: string | Date;
  assignedTo?: AssignedUser;
  createdAt?: string | Date;
};

// Database schema types
export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserData {
  id: string;
  user_auth_id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface Car {
  id: string;
  license_plate: string;
  car_brand_id: string;
  customer_id: string;
  model: string;
  year: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  created_at: string;
}

export interface CarBrand {
  id: string;
  name: string;
}

export interface RepairOrder {
  id: string;
  car_id: string;
  user_id: string;
  garage_id: string;
  reception_date: string;
  repair_date: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  notes?: string;
}

export interface Invoice {
  id: string;
  repair_order_id: string;
  issue_date: string;
  due_date: string;
  parts_cost: number;
  labor_cost: number;
  tax: number;
  total_amount: number;
  status: "Unpaid" | "Paid";
}

export interface RepairDetail {
  id: string;
  repair_order_id: string;
  part_id?: string;
  labor_id?: string;
  description: string;
  part_quantity?: number;
  total_amount: number;
  status: "Pending" | "Completed";
}

export interface Part {
  id: string;
  name: string;
  price: number;
}

export interface Labor {
  id: string;
  description: string;
  price: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
}

export interface RevenueReport {
  id: string;
  date: string;
  total_profit: number;
  car_brand_id: string;
  number_of_repairs: number;
}

export interface InventoryReport {
  id: string;
  part_id: string;
  garage_id: string;
  date: string;
  beginning_balance: number;
  ending_balance: number;
  incoming: number;
  outgoing: number;
}

export interface Garage {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  capacity: number;
}

export interface GarageUser {
  garage_id: string;
  user_id: string;
  role_id: string;
}
