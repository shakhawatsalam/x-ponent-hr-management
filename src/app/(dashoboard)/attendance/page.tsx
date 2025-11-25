/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { Attendance, AttendanceFormData } from "@/types/types";
import { Toast } from "@/components/Toast";
import { AttendanceTable } from "@/components/Tables/AttendanceTable";
import {
  AttendanceDialog,
  DeleteDialog,
} from "@/components/Dialogs/AttendanceDialogs";
import { useAuthContext } from "@/app/context/auth-provider";

export default function AttendancePage() {
  const { userRole } = useAuthContext();
  const {
    attendances,
    employees,
    loading,
    toast,
    showToast,
    fetchAttendances,
  } = useAttendance();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsEditModalOpen(true);
  };

  const handleDelete = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsDeleteModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedAttendance(null);
    setIsCreateModalOpen(true);
  };

  // API Operations
  const handleCreateAttendance = async (data: AttendanceFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast("Attendance added successfully", "success");
        setIsCreateModalOpen(false);
        fetchAttendances();
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to add attendance", "error");
      }
    } catch (error) {
      showToast("Error adding attendance", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAttendance = async (data: AttendanceFormData) => {
    if (!selectedAttendance) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/attendance/${selectedAttendance.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast("Attendance updated successfully", "success");
        setIsEditModalOpen(false);
        fetchAttendances();
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to update attendance", "error");
      }
    } catch (error) {
      showToast("Error updating attendance", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttendance = async () => {
    if (!selectedAttendance) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/attendance/${selectedAttendance.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Attendance deleted successfully", "success");
        setIsDeleteModalOpen(false);
        fetchAttendances();
      } else {
        showToast("Failed to delete attendance", "error");
      }
    } catch (error) {
      showToast("Error deleting attendance", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  const isHR = userRole === "hr";

  return (
    <div className='p-6'>
      <Toast toast={toast} />

      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Attendance Management</h1>
          <p className='text-gray-600 mt-1'>
            {isHR
              ? "Track and manage employee attendance records"
              : "View employee attendance records"}
          </p>
        </div>
        {isHR && (
          <Button onClick={handleCreateNew}>
            <Plus className='mr-2 h-4 w-4' /> Add Attendance
          </Button>
        )}
      </div>

      {/* Table */}
      <AttendanceTable
        attendances={attendances}
        userRole={userRole as string}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <AttendanceDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        employees={employees}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateAttendance}
        onCancel={() => setIsCreateModalOpen(false)}
      />

      <AttendanceDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        employees={employees}
        selectedAttendance={selectedAttendance}
        isEdit={true}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdateAttendance}
        onCancel={() => setIsEditModalOpen(false)}
      />

      <DeleteDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        selectedAttendance={selectedAttendance}
        isSubmitting={isSubmitting}
        onConfirm={handleDeleteAttendance}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
