import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Get token and verify
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Only HR can access this
    if (decoded.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const month = searchParams.get("month"); // Format: YYYY-MM

    if (!employeeId || !month) {
      return NextResponse.json(
        { error: "Employee ID and month are required" },
        { status: 400 }
      );
    }

    // Parse the month to get start and end dates
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    // Count attendance days for this employee in this month
    const attendanceCount = await prisma.attendance.count({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return NextResponse.json(
      { attendanceDays: attendanceCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get attendance days error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance days" },
      { status: 500 }
    );
  }
}
