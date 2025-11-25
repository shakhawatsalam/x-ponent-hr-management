/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Attendance, Employee, ToastState } from "@/types/types";
import { useState, useEffect, useCallback } from "react";

export const useAttendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
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
  const fetchUserRole = useCallback(async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }, []);

  const fetchAttendances = useCallback(async () => {
    try {
      const response = await fetch("/api/attendance");
      if (response.ok) {
        const data = await response.json();
        setAttendances(data.attendances);
      } else {
        showToast("Failed to fetch attendances", "error");
      }
    } catch (error) {
      showToast("Error fetching attendances", "error");
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

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchUserRole(),
        fetchAttendances(),
        fetchEmployees(),
      ]);
    };
    loadData();
  }, [fetchUserRole, fetchAttendances, fetchEmployees]);

  return {
    attendances,
    employees,
    loading,
    userRole,
    toast,
    showToast,
    fetchAttendances,
    setAttendances,
  };
};
