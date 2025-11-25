"use client";

import { useForm, Controller } from "react-hook-form";
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
import {
  Employee,
  PerformanceFormData,
  performanceFormSchema,
  EmployeePerformance,
} from "@/types/types";

interface PerformanceFormProps {
  employees: Employee[];
  performance?: EmployeePerformance; // Changed from Performance to EmployeePerformance
  isEdit?: boolean;
  isSubmitting: boolean;
  onSubmit: (data: PerformanceFormData) => void;
  onCancel: () => void;
}

export const PerformanceForm: React.FC<PerformanceFormProps> = ({
  employees,
  performance,
  isEdit = false,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceFormSchema),
    defaultValues: {
      employeeId: performance?.employee.id || "",
      title: performance?.title || "",
      assignAt: performance?.assignAt
        ? new Date(performance.assignAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      completedAt: performance?.completedAt
        ? new Date(performance.completedAt).toISOString().split("T")[0]
        : "",
      performanceRating: performance?.performanceRating?.toString() || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: PerformanceFormData) => {
    onSubmit(data);
  };

  const ratingOptions = [
    { value: "1", label: "1 - Poor" },
    { value: "2", label: "2 - Below Average" },
    { value: "3", label: "3 - Average" },
    { value: "4", label: "4 - Good" },
    { value: "5", label: "5 - Excellent" },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      {/* Employee Selection (only for create) */}
      {!isEdit && (
        <div>
          <Label htmlFor='employeeId'>Employee</Label>
          <Controller
            name='employeeId'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          {errors.employeeId && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.employeeId.message}
            </p>
          )}
        </div>
      )}

      {/* Employee Display (only for edit) */}
      {isEdit && performance && (
        <div>
          <Label>Employee</Label>
          <Input
            value={performance.employee.name}
            disabled
            className='bg-gray-50'
          />
        </div>
      )}

      {/* Task Title */}
      <div>
        <Label htmlFor='title'>Task Title</Label>
        <Input
          id='title'
          placeholder='Enter task title'
          {...register("title")}
        />
        {errors.title && (
          <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>
        )}
      </div>

      {/* Date Inputs */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='assignAt'>Assigned Date</Label>
          <Input id='assignAt' type='date' {...register("assignAt")} />
          {errors.assignAt && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.assignAt.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor='completedAt'>
            Completed Date {!isEdit && "(Optional)"}
          </Label>
          <Input id='completedAt' type='date' {...register("completedAt")} />
          {errors.completedAt && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.completedAt.message}
            </p>
          )}
        </div>
      </div>

      {/* Performance Rating */}
      <div>
        <Label htmlFor='performanceRating'>
          Performance Rating {!isEdit && "(Optional)"}
        </Label>
        <Controller
          name='performanceRating'
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder='No rating selected' />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.performanceRating && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.performanceRating.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting || !isValid}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isEdit ? "Update Performance" : "Assign Task"}
        </Button>
      </div>
    </form>
  );
};
