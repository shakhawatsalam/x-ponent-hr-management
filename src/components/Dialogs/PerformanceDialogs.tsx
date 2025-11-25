"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  EmployeePerformance,
  PerformanceFormData,
  Employee,
} from "@/types/types";
import { PerformanceForm } from "../Forms/PerformanceForm";

// Create Dialog
interface CreatePerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  isSubmitting: boolean;
  onSubmit: (data: PerformanceFormData) => void;
  onCancel: () => void;
}

export const CreatePerformanceDialog: React.FC<
  CreatePerformanceDialogProps
> = ({ open, onOpenChange, employees, isSubmitting, onSubmit, onCancel }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogDescription>
            Assign a task to an employee and track their performance
          </DialogDescription>
        </DialogHeader>

        <PerformanceForm
          employees={employees}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

// Edit Dialog
interface EditPerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  performance: EmployeePerformance | null; // Changed from Performance to EmployeePerformance
  employees: Employee[];
  isSubmitting: boolean;
  onSubmit: (data: PerformanceFormData) => void;
  onCancel: () => void;
}

export const EditPerformanceDialog: React.FC<EditPerformanceDialogProps> = ({
  open,
  onOpenChange,
  performance,
  employees,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Update Performance</DialogTitle>
          <DialogDescription>
            Update task completion date and performance rating
          </DialogDescription>
        </DialogHeader>

        <PerformanceForm
          employees={employees}
          performance={performance as EmployeePerformance}
          isEdit={true}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
