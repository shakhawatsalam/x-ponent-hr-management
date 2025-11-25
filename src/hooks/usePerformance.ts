/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Employee,
  EmployeePerformance,
  PerformanceFormData,
  ToastState,
} from "@/types/types";
import { useState, useEffect, useCallback } from "react";

export const usePerformance = () => {
  const [performances, setPerformances] = useState<EmployeePerformance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  // Toast management
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ show: true, message, type });
    },
    []
  );

  // Data fetching
  const fetchPerformances = useCallback(async () => {
    try {
      const response = await fetch("/api/performance");
      if (response.ok) {
        const data = await response.json();
        setPerformances(data.performances);
      } else {
        showToast("Failed to fetch performances", "error");
      }
    } catch (error) {
      showToast("Error fetching performances", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch("/api/employees");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, []);

  // API Operations
  const createPerformance = async (
    data: PerformanceFormData
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: data.employeeId,
          title: data.title,
          assignAt: data.assignAt,
          completedAt: data.completedAt || null,
          performanceRating: data.performanceRating
            ? parseInt(data.performanceRating)
            : null,
        }),
      });

      if (response.ok) {
        showToast("Task assigned successfully", "success");
        await fetchPerformances();
        return true;
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to assign task", "error");
        return false;
      }
    } catch (error) {
      showToast("Error assigning task", "error");
      return false;
    }
  };

  const updatePerformance = async (
    performanceId: string,
    data: PerformanceFormData
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/performance/${performanceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          assignAt: data.assignAt,
          completedAt: data.completedAt || null,
          performanceRating: data.performanceRating
            ? parseInt(data.performanceRating)
            : null,
        }),
      });

      if (response.ok) {
        showToast("Performance updated successfully", "success");
        await fetchPerformances();
        return true;
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to update performance", "error");
        return false;
      }
    } catch (error) {
      showToast("Error updating performance", "error");
      return false;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPerformances(), fetchEmployees()]);
    };
    loadData();
  }, [fetchPerformances, fetchEmployees]);

  return {
    performances,
    employees,
    loading,
    toast,
    fetchPerformances,
    createPerformance,
    updatePerformance,
    showToast,
  };
};
