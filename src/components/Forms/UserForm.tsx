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
import { CreateUserFormData, createUserSchema, EditUserFormData, editUserSchema, User } from "@/types/types";


interface UserFormProps {
  user?: User;
  isEdit?: boolean;
  isSubmitting: boolean;
  onSubmit: (data: CreateUserFormData | EditUserFormData) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  isEdit = false,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const schema = isEdit ? editUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateUserFormData | EditUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      address: user?.address || "",
      designation: user?.designation || "",
      department: user?.department || "",
      role: (user?.role as "hr" | "manager" | "employee") || "employee",
      joiningDate: user?.joiningDate
        ? new Date(user.joiningDate).toISOString().split("T")[0]
        : "",
      salary: user?.salary?.toString() || "",
      contractExpire: user?.contractExpire
        ? new Date(user.contractExpire).toISOString().split("T")[0]
        : "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: CreateUserFormData | EditUserFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        {/* Name */}
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' {...register("name")} />
          {errors.name && (
            <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' {...register("email")} />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor='phone'>Phone</Label>
          <Input id='phone' {...register("phone")} />
          {errors.phone && (
            <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor='password'>
            {isEdit ? "Password (leave blank to keep current)" : "Password"}
          </Label>
          <Input id='password' type='password' {...register("password")} />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className='col-span-2'>
          <Label htmlFor='address'>Address</Label>
          <Input id='address' {...register("address")} />
          {errors.address && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Designation */}
        <div>
          <Label htmlFor='designation'>Designation</Label>
          <Input id='designation' {...register("designation")} />
          {errors.designation && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <Label htmlFor='department'>Department</Label>
          <Input id='department' {...register("department")} />
          {errors.department && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <Label htmlFor='role'>Role</Label>
          <Controller
            name='role'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='hr'>HR</SelectItem>
                  <SelectItem value='manager'>Manager</SelectItem>
                  <SelectItem value='employee'>Employee</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className='text-red-500 text-sm mt-1'>{errors.role.message}</p>
          )}
        </div>

        {/* Joining Date */}
        <div>
          <Label htmlFor='joiningDate'>Joining Date</Label>
          <Input id='joiningDate' type='date' {...register("joiningDate")} />
          {errors.joiningDate && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.joiningDate.message}
            </p>
          )}
        </div>

        {/* Salary */}
        <div>
          <Label htmlFor='salary'>Salary</Label>
          <Input id='salary' type='number' {...register("salary")} />
          {errors.salary && (
            <p className='text-red-500 text-sm mt-1'>{errors.salary.message}</p>
          )}
        </div>

        {/* Contract Expiry */}
        <div>
          <Label htmlFor='contractExpire'>Contract Expiry</Label>
          <Input
            id='contractExpire'
            type='date'
            {...register("contractExpire")}
          />
          {errors.contractExpire && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.contractExpire.message}
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
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};
