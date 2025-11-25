import { headers } from "next/headers";

export async function getCurrentUser() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  const userRole = headersList.get("x-user-role");
 console.log(userId, "🚨🚨🚨🚨🚨🚨");
  if (!userId || !userRole) return null;

  return { userId, role: userRole as "hr" | "manager" | "employee" };
}
