/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Employee,
  MonthOption,
  Payroll,
  PayrollFormData,
  ToastState,
} from "@/types/types";
import { useState, useEffect, useCallback, useMemo } from "react";

export const usePayroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceDays, setAttendanceDays] = useState<number>(0);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const WORKING_DAYS = 22;

  // Memoize month options
  const monthOptions = useMemo((): MonthOption[] => {
    const months: MonthOption[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      const label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      months.push({ value, label });
    }
    return months;
  }, []);

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
  const fetchPayrolls = useCallback(async () => {
    try {
      const response = await fetch("/api/payroll");
      if (response.ok) {
        const data = await response.json();
        setPayrolls(data.payrolls);
      } else {
        showToast("Failed to fetch payrolls", "error");
      }
    } catch (error) {
      showToast("Error fetching payrolls", "error");
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

  const fetchAttendanceDays = useCallback(
    async (employeeId: string, payrollMonth: string) => {
      try {
        const response = await fetch(
          `/api/payroll/attendance-days?employeeId=${employeeId}&month=${payrollMonth}`
        );
        if (response.ok) {
          const data = await response.json();
          setAttendanceDays(data.attendanceDays);
          return data.attendanceDays;
        }
        return 0;
      } catch (error) {
        console.error("Error fetching attendance days:", error);
        return 0;
      }
    },
    []
  );

  // API Operations
  const createPayroll = async (
    data: PayrollFormData & { totalAmount: number }
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: data.employeeId,
          payrollMonth: data.payrollMonth,
          totalAmount: data.totalAmount,
          reduceAmount: parseFloat(data.reduceAmount),
        }),
      });

      if (response.ok) {
        showToast("Payroll created successfully", "success");
        await fetchPayrolls();
        return true;
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to create payroll", "error");
        return false;
      }
    } catch (error) {
      showToast("Error creating payroll", "error");
      return false;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPayrolls(), fetchEmployees()]);
    };
    loadData();
  }, [fetchPayrolls, fetchEmployees]);

  return {
    payrolls,
    employees,
    loading,
    toast,
    attendanceDays,
    monthOptions,
    WORKING_DAYS,
    fetchPayrolls,
    fetchAttendanceDays,
    createPayroll,
    showToast,
    setAttendanceDays,
  };
};
