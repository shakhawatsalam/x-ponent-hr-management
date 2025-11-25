import { z } from "zod";

// Zod Schemas
export const attendanceFormSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    date: z.string().min(1, "Date is required"),
    checkIn: z.string().min(1, "Check-in time is required"),
    checkOut: z.string().min(1, "Check-out time is required"),
  })
  .refine(
    (data) => {
      if (!data.checkIn || !data.checkOut) return true;
      return data.checkOut > data.checkIn;
    },
    {
      message: "Check-out time must be after check-in time",
      path: ["checkOut"],
    }
  );

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

// Interfaces
export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
}

export interface Attendance {
  id: string;
  employee: Employee;
  date: string;
  checkIn: string;
  checkOut: string;
}

export interface FormErrors {
  employeeId?: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// user management
export const baseUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(2, "Department is required"),
  role: z.enum(["hr", "manager", "employee"]),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z
    .string()
    .refine((val) => parseFloat(val) > 0, "Valid salary is required"),
  contractExpire: z.string().min(1, "Contract expiry date is required"),
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const editUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters if provided",
    }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  role: string;
  joiningDate: string;
  salary: number;
  contractExpire: string;
}


// Payroll Types
export const payrollFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  payrollMonth: z.string().min(1, "Payroll month is required"),
  reduceAmount: z.string().refine((val) => parseFloat(val) >= 0, {
    message: "Reduce amount cannot be negative",
  }),
});

export type PayrollFormData = z.infer<typeof payrollFormSchema>;

// Interfaces
export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  salary: number;
}

export interface Payroll {
  id: string;
  payrollFor: Employee;
  payrollMonth: string;
  totalAmount: number;
  reduceAmount: number;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface FormErrors {
  employeeId?: string;
  payrollMonth?: string;
  reduceAmount?: string;
}

export interface MonthOption {
  value: string;
  label: string;
}


// Performance


export const performanceFormSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    assignAt: z.string().min(1, "Assignment date is required"),
    completedAt: z.string().optional(),
    performanceRating: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.completedAt && data.assignAt) {
        return new Date(data.completedAt) >= new Date(data.assignAt);
      }
      return true;
    },
    {
      message: "Completion date must be after assignment date",
      path: ["completedAt"],
    }
  )
  .refine(
    (data) => {
      if (data.performanceRating) {
        const rating = parseInt(data.performanceRating);
        return rating >= 1 && rating <= 5;
      }
      return true;
    },
    {
      message: "Rating must be between 1 and 5",
      path: ["performanceRating"],
    }
  );

export type PerformanceFormData = z.infer<typeof performanceFormSchema>;


export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
}


export interface EmployeePerformance {
  id: string;
  employee: Employee;
  title: string;
  assignAt: string;
  completedAt: string | null;
  performanceRating: number | null;
}




