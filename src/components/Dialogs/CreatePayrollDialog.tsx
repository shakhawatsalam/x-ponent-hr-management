"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee, MonthOption, PayrollFormData } from "@/types/types";
import { PayrollForm } from "../Forms/PayrollForm";



interface CreatePayrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  monthOptions: MonthOption[];
  workingDays: number;
  attendanceDays: number;
  isSubmitting: boolean;
  onSubmit: (data: PayrollFormData & { totalAmount: number }) => void;
  onCancel: () => void;
  onEmployeeChange: (employeeId: string) => void;
  onMonthChange: (month: string) => void;
  fetchAttendanceDays: (
    employeeId: string,
    payrollMonth: string
  ) => Promise<number>;
}

export const CreatePayrollDialog: React.FC<CreatePayrollDialogProps> = ({
  open,
  onOpenChange,
  employees,
  monthOptions,
  workingDays,
  attendanceDays,
  isSubmitting,
  onSubmit,
  onCancel,
  onEmployeeChange,
  onMonthChange,
  fetchAttendanceDays,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Create Payroll</DialogTitle>
          <DialogDescription>
            Generate payroll for an employee based on attendance
          </DialogDescription>
        </DialogHeader>

        <PayrollForm
          employees={employees}
          monthOptions={monthOptions}
          workingDays={workingDays}
          attendanceDays={attendanceDays}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onEmployeeChange={onEmployeeChange}
          onMonthChange={onMonthChange}
          fetchAttendanceDays={fetchAttendanceDays}
        />
      </DialogContent>
    </Dialog>
  );
};
