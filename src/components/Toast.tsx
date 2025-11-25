"use client";

import { ToastState } from "@/types/types";

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        toast.type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white transition-all duration-300`}>
      {toast.message}
    </div>
  );
};
