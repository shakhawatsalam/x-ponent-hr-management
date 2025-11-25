/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { usePayroll } from "@/hooks/usePayroll";
import { PayrollFormData } from "@/types/types";
import { Toast } from "@/components/Toast";
import { PayrollTable } from "@/components/Tables/PayrollTable";
import { CreatePayrollDialog } from "@/components/Dialogs/CreatePayrollDialog";


export default function PayrollPage() {
  const {
    payrolls,
    employees,
    loading,
    toast,
    attendanceDays,
    monthOptions,
    WORKING_DAYS,
    fetchAttendanceDays,
    createPayroll,
  } = usePayroll();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreatePayroll = async (
    data: PayrollFormData & { totalAmount: number }
  ) => {
    setIsSubmitting(true);
    const success = await createPayroll(data);
    if (success) {
      setIsCreateModalOpen(false);
    }
    setIsSubmitting(false);
  };

  // Empty handlers for form events (could be extended if needed)
  const handleEmployeeChange = (employeeId: string) => {
    // Can be used for additional logic when employee changes
  };

  const handleMonthChange = (month: string) => {
    // Can be used for additional logic when month changes
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='p-6'>
      <Toast toast={toast} />

      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Payroll Management</h1>
          <p className='text-gray-600 mt-1'>
            Generate and manage employee payroll records
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className='mr-2 h-4 w-4' /> Create Payroll
        </Button>
      </div>

      {/* Table */}
      <PayrollTable payrolls={payrolls} />

      {/* Create Payroll Dialog */}
      <CreatePayrollDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        employees={employees}
        monthOptions={monthOptions}
        workingDays={WORKING_DAYS}
        attendanceDays={attendanceDays}
        isSubmitting={isSubmitting}
        onSubmit={handleCreatePayroll}
        onCancel={() => setIsCreateModalOpen(false)}
        onEmployeeChange={handleEmployeeChange}
        onMonthChange={handleMonthChange}
        fetchAttendanceDays={fetchAttendanceDays}
      />
    </div>
  );
}
