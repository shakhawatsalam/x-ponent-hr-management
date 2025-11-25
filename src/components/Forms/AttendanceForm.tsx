/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { AttendanceFormData, attendanceFormSchema, Employee } from "@/types/types";

interface AttendanceFormProps {
  employees: Employee[];
  initialData?: AttendanceFormData;
  selectedAttendance?: any;
  isEdit?: boolean;
  isSubmitting: boolean;
  onSubmit: (data: AttendanceFormData) => void;
  onCancel: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  employees,
  initialData,
  selectedAttendance,
  isEdit = false,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formData = watch();

  const handleFormSubmit = (data: AttendanceFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      {/* Employee Selection */}
      <div>
        <Label htmlFor='employeeId'>Employee</Label>
        {isEdit ? (
          <Input
            value={selectedAttendance?.employee.name || ""}
            disabled
            className='bg-gray-50'
          />
        ) : (
          <>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => setValue("employeeId", value)}>
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
          </>
        )}
      </div>

      {/* Date */}
      <div>
        <Label htmlFor='date'>Date</Label>
        <Input id='date' type='date' {...register("date")} />
        {errors.date && (
          <p className='text-red-500 text-sm mt-1'>{errors.date.message}</p>
        )}
      </div>

      {/* Time Inputs */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='checkIn'>Check In</Label>
          <Input id='checkIn' type='time' {...register("checkIn")} />
          {errors.checkIn && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.checkIn.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor='checkOut'>Check Out</Label>
          <Input id='checkOut' type='time' {...register("checkOut")} />
          {errors.checkOut && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.checkOut.message}
            </p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting || !isValid}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isEdit ? "Update Attendance" : "Add Attendance"}
        </Button>
      </div>
    </form>
  );
};
