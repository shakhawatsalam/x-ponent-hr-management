"use client";

import React, { useEffect, useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (isLoading) {
    return (
      <header className='flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <div className='ml-auto'>
          <div className='h-10 w-32 animate-pulse rounded-md bg-gray-200' />
        </div>
      </header>
    );
  }

  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 h-4' />

      {/* Account Dropdown */}
      <div className='ml-auto'>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium'>
                  {getInitials(user.name)}
                </div>
                <div className='hidden md:block text-left'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatRole(user.role)}
                  </p>
                </div>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='px-2 py-2 text-sm'>
                <p className='font-medium'>{user.name}</p>
                <p className='text-xs text-muted-foreground'>{user.email}</p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Role: {formatRole(user.role)}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='cursor-pointer text-red-600 focus:text-red-600'>
                <LogOut className='mr-2 h-4 w-4' />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant='default'>
            <Link href='/login'>Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
