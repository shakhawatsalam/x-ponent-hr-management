/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthContext } from "@/app/context/auth-provider";
import { ToastState, User } from "@/types/types";
import { useState, useEffect, useCallback } from "react";


export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const { userRole } = useAuthContext();

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
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        showToast("Failed to fetch users", "error");
      }
    } catch (error) {
      showToast("Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  
  const createUser = async (data: any): Promise<boolean> => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast("User created successfully", "success");
        await fetchUsers();
        return true; // Explicitly return true
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to create user", "error");
        return false; // Explicitly return false
      }
    } catch (error) {
      showToast("Error creating user", "error");
      return false; // Explicitly return false
    }
  };

  const updateUser = async (userId: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast("User updated successfully", "success");
        await fetchUsers();
        return true; // Explicitly return true
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to update user", "error");
        return false; // Explicitly return false
      }
    } catch (error) {
      showToast("Error updating user", "error");
      return false; // Explicitly return false
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("User deleted successfully", "success");
        await fetchUsers();
        return true; // Explicitly return true
      } else {
        showToast("Failed to delete user", "error");
        return false; // Explicitly return false
      }
    } catch (error) {
      showToast("Error deleting user", "error");
      return false; // Explicitly return false
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    toast,
    userRole,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    showToast,
  };
};
