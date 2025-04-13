import { z } from "zod";

export const taskFormSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"] as const),
  customer: z.object({
    name: z
      .string()
      .nonempty("Customer name is required")
      .min(2, "Customer name must be at least 2 characters"),
  }),
  vehicle: z.object({
    make: z.string().nonempty("Make is required"),
    model: z.string().nonempty("Model is required"),
    year: z
      .string()
      .nonempty("Year is required")
      .regex(/^\d{4}$/, "Year must be valid")
      .refine((year) => {
        const yearNum = parseInt(year, 10);
        return yearNum >= 1886 && yearNum <= 2100;
      }, "Year must be between 1886 and 2100"),
  }),
  dueDate: z.date().optional(),
});
