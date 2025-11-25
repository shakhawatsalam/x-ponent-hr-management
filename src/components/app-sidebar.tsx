"use client";

import {
  CalendarDays,
  ChartNoAxesCombined,
  HandCoins,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

// Menu items with role permissions
const items = [
  {
    title: "User Management",
    url: "/users",
    icon: Users,
    roles: ["hr"], // Only HR can access
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: CalendarDays,
    roles: ["hr", "manager"], // Both HR and Manager can access
  },
  {
    title: "Performance",
    url: "/performance",
    icon: ChartNoAxesCombined,
    roles: ["manager"], // Both HR and Manager can access
  },
  {
    title: "Payroll",
    url: "/payroll",
    icon: HandCoins,
    roles: ["hr"], // Both HR and Manager can access
  },
];

export function AppSidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user's role
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/me");

        if (response?.ok) {
          const data = await response.json();
          console.log(data);
          setUserRole(data?.user?.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Filter menu items based on user role
  const filteredItems = items.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>HR Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <p className='text-sm text-muted-foreground p-4'>Loading...</p>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HR Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
