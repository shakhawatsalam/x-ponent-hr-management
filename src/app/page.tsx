"use client";
import { redirect } from "next/navigation";
import { useAuthContext } from "./context/auth-provider";
import Loading from "@/components/Loading";

export default function Home() {
  const { userRole, isLoading } = useAuthContext();
  if (isLoading) {
    return <Loading />;
  }
  if (userRole && userRole === "hr") {
    redirect(`/users`);
  }
  if (userRole && userRole === "manager") {
    redirect(`/attendance`);
  }
}
