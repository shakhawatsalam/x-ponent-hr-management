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

    // Both HR and Manager can view attendances
    if (decoded.role !== "hr" && decoded.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const attendances = await prisma.attendance.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ attendances }, { status: 200 });
  } catch (error) {
    console.error("Get attendances error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendances" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Only HR can create attendance records
    if (decoded.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { employeeId, date, checkIn, checkOut } = body;

    // Validate required fields
    if (!employeeId || !date || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Check if attendance already exists for this employee on this date
    const attendanceDate = new Date(date);
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: attendanceDate,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: "Attendance already exists for this employee on this date" },
        { status: 400 }
      );
    }

    // Convert time strings to DateTime
    const checkInDateTime = new Date(`${date}T${checkIn}:00`);
    const checkOutDateTime = new Date(`${date}T${checkOut}:00`);

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: attendanceDate,
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Attendance added successfully", attendance },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create attendance error:", error);
    return NextResponse.json(
      { error: "Failed to add attendance" },
      { status: 500 }
    );
  }
}
