import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get token and verify
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Only HR can update attendance records
    if (decoded.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { date, checkIn, checkOut } = body;

    // Check if attendance record exists
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: "Attendance record not found" },
        { status: 404 }
      );
    }

    // Convert time strings to DateTime
    const checkInDateTime = new Date(`${date}T${checkIn}:00`);
    const checkOutDateTime = new Date(`${date}T${checkOut}:00`);

    // Update attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: {
        date: new Date(date),
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
      {
        message: "Attendance updated successfully",
        attendance: updatedAttendance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update attendance error:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get token and verify
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Only HR can delete attendance records
    if (decoded.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if attendance record exists
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: "Attendance record not found" },
        { status: 404 }
      );
    }

    // Delete attendance record
    await prisma.attendance.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Attendance deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete attendance error:", error);
    return NextResponse.json(
      { error: "Failed to delete attendance" },
      { status: 500 }
    );
  }
}
