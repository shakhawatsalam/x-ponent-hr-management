"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Attendance, AttendanceFormData, Employee } from "@/types/types";
import { AttendanceForm } from "../Forms/AttendanceForm";



// Create/Edit Dialog
interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  selectedAttendance?: Attendance | null;
  isEdit?: boolean;
  isSubmitting: boolean;
  onSubmit: (data: AttendanceFormData) => void;
  onCancel: () => void;
}

export const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  open,
  onOpenChange,
  employees,
  selectedAttendance,
  isEdit = false,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const getInitialFormData = (): AttendanceFormData => {
    if (isEdit && selectedAttendance) {
      const checkInTime = new Date(selectedAttendance.checkIn)
        .toTimeString()
        .slice(0, 5);
      const checkOutTime = new Date(selectedAttendance.checkOut)
        .toTimeString()
        .slice(0, 5);

      return {
        employeeId: selectedAttendance.employee.id,
        date: new Date(selectedAttendance.date).toISOString().split("T")[0],
        checkIn: checkInTime,
        checkOut: checkOutTime,
      };
    }

    return {
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      checkIn: "09:00",
      checkOut: "17:00",
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Attendance" : "Add Attendance"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update attendance record"
              : "Record employee attendance for the day"}
          </DialogDescription>
        </DialogHeader>

        <AttendanceForm
          employees={employees}
          initialData={getInitialFormData()}
          selectedAttendance={selectedAttendance}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAttendance: Attendance | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedAttendance,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this attendance record for{" "}
            {selectedAttendance?.employee.name} on{" "}
            {selectedAttendance &&
              new Date(selectedAttendance.date).toLocaleDateString()}
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            No, Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
