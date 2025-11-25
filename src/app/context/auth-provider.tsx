/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  department?: string;
};

type AuthContextType = {
  user: UserType | null;
  userRole: string | null;
  isLoading: boolean;
  error: any;
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
 
  // Fetch current user
  const fetchUser = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/me", { cache: "no-store" });

      if (!response.ok) {
        setUser(null);
        setUserRole(null);
        return;
      }

      const data = await response.json();

      setUser(data.user);
      setUserRole(data.user?.role || null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isLoading,
        error,
        refetch: fetchUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
