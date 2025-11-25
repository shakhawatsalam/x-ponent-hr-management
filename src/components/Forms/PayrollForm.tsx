/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee, MonthOption, PayrollFormData, payrollFormSchema } from "@/types/types";
import { PayrollCalculation } from "./PayrollCalculation";



interface PayrollFormProps {
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

export const PayrollForm: React.FC<PayrollFormProps> = ({
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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [calculatedPayable, setCalculatedPayable] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PayrollFormData>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      employeeId: "",
      payrollMonth: "",
      reduceAmount: "0",
    },
    mode: "onChange",
  });

  const formData = watch();
  const reduceAmount = formData.reduceAmount || "0";

  // Calculate payable amount when employee, month, or attendance changes
  useEffect(() => {
    if (selectedEmployee && formData.payrollMonth) {
      const payable = (selectedEmployee.salary / workingDays) * attendanceDays;
      setCalculatedPayable(payable);
    }
  }, [selectedEmployee, formData.payrollMonth, attendanceDays, workingDays]);

  // Handle employee selection
  const handleEmployeeSelect = async (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId) || null;
    setSelectedEmployee(employee);
    setValue("employeeId", employeeId);
    onEmployeeChange(employeeId);

    if (formData.payrollMonth && employee) {
      await fetchAttendanceDays(employeeId, formData.payrollMonth);
    }
  };

  // Handle month selection
  const handleMonthSelect = async (month: string) => {
    setValue("payrollMonth", month);
    onMonthChange(month);

    if (formData.employeeId && selectedEmployee) {
      await fetchAttendanceDays(formData.employeeId, month);
    }
  };

  const handleFormSubmit = (data: PayrollFormData) => {
    const totalAmount = calculatedPayable - parseFloat(data.reduceAmount);
    onSubmit({ ...data, totalAmount });
  };

  const getCurrentMonth = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      {/* Employee Selection */}
      <div>
        <Label htmlFor='employeeId'>Select Employee</Label>
        <Select
          value={formData.employeeId}
          onValueChange={handleEmployeeSelect}>
          <SelectTrigger>
            <SelectValue placeholder='Select employee' />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} - {employee.designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.employeeId && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.employeeId.message}
          </p>
        )}
      </div>

      {/* Month Selection */}
      <div>
        <Label htmlFor='payrollMonth'>Select Month</Label>
        <Select value={formData.payrollMonth} onValueChange={handleMonthSelect}>
          <SelectTrigger>
            <SelectValue placeholder='Select month' />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.payrollMonth && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.payrollMonth.message}
          </p>
        )}
      </div>

      {/* Calculation Display */}
      {selectedEmployee && formData.payrollMonth && (
        <PayrollCalculation
          employee={selectedEmployee}
          attendanceDays={attendanceDays}
          calculatedPayable={calculatedPayable}
          reduceAmount={reduceAmount}
          workingDays={workingDays}
        />
      )}

      {/* Deduction Input */}
      <div>
        <Label htmlFor='reduceAmount'>Deduction Amount (Optional)</Label>
        <Input
          id='reduceAmount'
          type='number'
          min='0'
          step='0.01'
          placeholder='0.00'
          {...register("reduceAmount")}
        />
        {errors.reduceAmount && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.reduceAmount.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={
            isSubmitting ||
            !isValid ||
            !selectedEmployee ||
            !formData.payrollMonth
          }>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Confirm & Create Payroll
        </Button>
      </div>
    </form>
  );
};
