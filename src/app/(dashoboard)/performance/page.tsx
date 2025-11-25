"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";
import { PerformanceFormData, EmployeePerformance } from "@/types/types"; // Import the renamed interface
import { Toast } from "@/components/Toast";
import { PerformanceTable } from "@/components/Tables/PerformanceTable";
import {
  CreatePerformanceDialog,
  EditPerformanceDialog,
} from "@/components/Dialogs/PerformanceDialogs"; // Import the dialogs

export default function PerformancePage() {
  const {
    performances,
    employees,
    loading,
    toast,
    createPerformance,
    updatePerformance,
  } = usePerformance();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] =
    useState<EmployeePerformance | null>(null); // Changed type
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleEdit = (performance: EmployeePerformance) => {
    // Changed parameter type
    setSelectedPerformance(performance);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedPerformance(null);
    setIsCreateModalOpen(true);
  };

  // API Operations
  const handleCreatePerformance = async (data: PerformanceFormData) => {
    setIsSubmitting(true);
    const success = await createPerformance(data);
    if (success) {
      setIsCreateModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleUpdatePerformance = async (data: PerformanceFormData) => {
    if (!selectedPerformance) return;

    setIsSubmitting(true);
    const success = await updatePerformance(selectedPerformance.id, data);
    if (success) {
      setIsEditModalOpen(false);
    }
    setIsSubmitting(false);
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
          <h1 className='text-3xl font-bold'>Performance Management</h1>
          <p className='text-gray-600 mt-1'>
            Assign tasks and track employee performance
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className='mr-2 h-4 w-4' /> Assign Task
        </Button>
      </div>

      {/* Table */}
      <PerformanceTable performances={performances} onEdit={handleEdit} />

      {/* Dialogs */}
      <CreatePerformanceDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        employees={employees}
        isSubmitting={isSubmitting}
        onSubmit={handleCreatePerformance}
        onCancel={() => setIsCreateModalOpen(false)}
      />

      <EditPerformanceDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        performance={selectedPerformance}
        employees={employees}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdatePerformance}
        onCancel={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
